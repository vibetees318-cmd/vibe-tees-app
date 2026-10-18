import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI with recommended telemetry header and server-side key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * 1. Multi-turn Gemini Chatbot Endpoint for Customer Support and Orders
 */
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      model = 'gemini-3.8-flash',
      taskComplexity = 'general',
      contextData = {},
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Select model according to user requirement & task complexity:
    let selectedModel = model;
    if (taskComplexity === 'complex') {
      selectedModel = 'gemini-4-argon';
    } else if (taskComplexity === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (taskComplexity === 'general') {
      selectedModel = 'gemini-3.8-flash';
    }

    const systemInstruction = `You are "VibeBot", the dedicated AI customer support & streetwear concierge for "Vibe Tees" (Made with love for Bharat 🇮🇳).
Your core capabilities:
1. Live Order Tracking & Customer Service: Inquire about order status, dispatch status, 2-4 business day express shipping timelines, returns/exchanges, and address updates.
2. Fabric & Product Technicals: Explain oversized fit vs regular fit, 280 GSM 100% combed cotton, 450 GSM French Terry heavyweight winter hoodies, pre-shrunk mineral washes, and screen printing durability.
3. Reseller & Wholesale Margin Guidance: Explain how the 0-investment reselling business model works, setting custom profit margins (e.g. ₹400-₹600 markup per tee), sharing catalogs directly to WhatsApp contacts, and automated Cash-on-Delivery margin payouts to bank accounts.
4. Supplier Onboarding & EID: Explain how manufacturers and wholesalers can sell on Vibe Tees without a GSTIN using a government Enrolment ID (EID) under the Section 10 Composition Scheme in minutes.
Tone: Urban, energetic, helpful, culturally resonant for Bharat, transparent, and direct. Keep mobile answers crisp and easily scannable with bullet points when relevant.`;

    // Format previous messages for chat history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || m.text || '' }],
    }));

    const latestMessage = messages[messages.length - 1];
    const userPrompt = latestMessage.content || latestMessage.text || '';

    // Append context info to user prompt if provided
    let fullPrompt = userPrompt;
    if (contextData && Object.keys(contextData).length > 0) {
      fullPrompt = `[Live Session Context: ${JSON.stringify(contextData)}]\n\n${userPrompt}`;
    }

    const chat = ai.chats.create({
      model: selectedModel,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history,
    });

    const response = await chat.sendMessage({
      message: fullPrompt,
    });

    return res.json({
      reply:
        response.text ||
        "I'm right here! How can I assist you with your Vibe Tees streetwear, sizing, or order tracking today?",
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Chat generation failed',
      fallback:
        'Our concierge is momentarily overloaded. You can also reach our support desk at vibetees318@gmail.com.',
    });
  }
});

/**
 * 2. Veo AI Video Generation Endpoint (veo-3.1-lite-generate-preview)
 */
app.post('/api/generate-video', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      prompt,
      aspectRatio = '16:9', // '16:9' or '9:16'
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 image is required' });
    }

    // Clean base64 header if included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const videoPrompt =
      prompt ||
      'Cinematic 3D slow-motion streetwear showcase, dramatic volumetric lighting, subtle fabric movement, rotating camera, premium luxury brand visual';

    // Model: veo-3.1-lite-generate-preview (approved Veo video model)
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: videoPrompt,
      image: {
        imageBytes: cleanBase64,
        mimeType: mimeType || 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
      },
    });

    return res.json({
      success: true,
      operationName: operation.name,
      message: 'Video generation operation started with Veo',
    });
  } catch (error: any) {
    console.error('Veo video generation error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to start video generation',
    });
  }
});

/**
 * 3. Video Polling Status Endpoint (Supports both GET and POST)
 */
app.all(['/api/video-status', '/api/video-status/:operationId(*)'], async (req, res) => {
  try {
    const operationName =
      req.params.operationId || req.body?.operationName || (req.query?.operationName as string);

    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    if (updated.done) {
      const generated = updated.response?.generatedVideos?.[0];
      return res.json({
        done: true,
        videoUri: generated?.video?.uri || null,
        metadata: updated.metadata,
      });
    }

    return res.json({
      done: false,
      metadata: updated.metadata,
    });
  } catch (error: any) {
    console.error('Failed to get video operation status:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to check video status',
    });
  }
});

/**
 * 4. Video Download Proxy Endpoint (Streams video directly to client)
 */
app.all(['/api/video-download', '/api/video-download/:operationId(*)'], async (req, res) => {
  try {
    const operationName =
      req.params.operationId || req.body?.operationName || (req.query?.operationName as string);

    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'Video URI not available' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Failed to download video stream:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to download video',
    });
  }
});

/**
 * Mount Vite in dev mode or serve static files in production
 */
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vibe Tees Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
