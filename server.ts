import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI();

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

    // Select model according to user requirement:
    // "Use gemini-4-argon for particularly complex tasks, gemini-3.8-flash for general tasks, and gemini-3.1-flash-lite for tasks that should happen fast."
    let selectedModel = model;
    if (taskComplexity === 'complex') {
      selectedModel = 'gemini-4-argon';
    } else if (taskComplexity === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (taskComplexity === 'general') {
      selectedModel = 'gemini-3.8-flash';
    }

    const systemInstruction = `You are "VibeBot", the dedicated AI customer support & streetwear concierge for "Vibe Tees" (Made with love for Bharat).
Your responsibilities:
1. Assist customers with live order tracking, return queries, shipping timelines (2-4 business days express), and size recommendations.
2. Explain premium fabric specifications: 280 GSM 100% combed cotton, 450 GSM diagonal French Terry heavyweight hoodies, pre-shrunk mineral washes.
3. Reseller guidance: Explain how the 0-investment reselling model works, margin calculation (setting custom markup like ₹400-₹600/piece), WhatsApp catalog sharing, and COD margin payouts.
4. Supplier Enrolment: Guide suppliers through GSTIN registration or selling without GST using an Enrolment ID (EID) in minutes.
5. If current order or customer context is provided, personalize responses with that data.
Tone: Friendly, urban, street-smart, transparent, and direct. Keep replies concise and easy to read on mobile screens.`;

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
      fullPrompt = `[Context Data: ${JSON.stringify(contextData)}]\n\n${userPrompt}`;
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
      reply: response.text || "I'm right here! How can I assist you with your Vibe Tees streetwear or order today?",
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Chat generation failed',
      fallback: 'Our concierge is momentarily overloaded. You can also reach our support desk at vibetees318@gmail.com.',
    });
  }
});

/**
 * 2. Veo AI Video Generation Endpoint (veo-3.1-fast-generate-preview)
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

    // Model: veo-3.1-fast-generate-preview (as specified in user requirements)
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
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
 * 3. Video Polling Status Endpoint
 */
app.get('/api/video-status/:operationId(*)', async (req, res) => {
  try {
    const operationName = req.params.operationId;
    const operation = await ai.operations.getVideosOperation({ name: operationName });

    if (operation.done) {
      const generated = operation.response?.generatedVideos?.[0];
      return res.json({
        done: true,
        videoUri: generated?.video?.uri || null,
        metadata: operation.metadata,
      });
    }

    return res.json({
      done: false,
      metadata: operation.metadata,
    });
  } catch (error: any) {
    console.error('Failed to get video operation status:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to check video status',
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
