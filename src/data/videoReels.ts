import { VideoReelDeal } from '../types';
import acidWashImg from '../assets/images/tee_oversized_acid_wash_1792082131228.jpg';
import retroCyberImg from '../assets/images/tee_retro_cyber_anime_1792082132438.jpg';
import hoodieHeavyweightImg from '../assets/images/hoodie_heavyweight_slate_1792082132014.jpg';
import streetwearCampaignImg from '../assets/images/vibe_hero_streetwear_1792082130778.jpg';

// High-performance public CDN streetwear & clothing promotional videos (fast CDN, auto-playable on mobile/Safari/Chrome)
export const DAILY_VIDEO_REELS: VideoReelDeal[] = [
  {
    id: 'reel-01',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-yellow-hoodie-and-a-knit-cap-39871-large.mp4',
    posterImage: streetwearCampaignImg,
    badge: "70% OFF FLASH SALE",
    discountPercent: 70,
    productID: 'VT-PROD-01',
    title: 'Origins Heavyweight Acid-Wash Tee',
    originalPrice: 2499,
    dealPrice: 749,
    dayIndex: 1, // Mon / daily rotation
    tagline: '280 GSM Mineral Washed Boxy Silhouette',
  },
  {
    id: 'reel-02',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-lights-39876-large.mp4',
    posterImage: retroCyberImg,
    badge: "60% OFF TODAY'S DROP",
    discountPercent: 60,
    productID: 'VT-PROD-02',
    title: 'Cybernetic Unit 1999 Vintage Graphic Tee',
    originalPrice: 2199,
    dealPrice: 879,
    dayIndex: 2,
    tagline: '90s Subculture Screenprint on Off-White Jersey',
  },
  {
    id: 'reel-03',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-young-woman-in-a-leather-jacket-and-sunglasses-41221-large.mp4',
    posterImage: hoodieHeavyweightImg,
    badge: "50% OFF TODAY'S DEAL",
    discountPercent: 50,
    productID: 'VT-PROD-03',
    title: 'Slate Studio Drop-Shoulder Heavyweight Hoodie',
    originalPrice: 3999,
    dealPrice: 1999,
    dayIndex: 3,
    tagline: '450 GSM Diagonal French Terry Luxury Loopback',
  },
  {
    id: 'reel-04',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterImage: acidWashImg,
    badge: "55% OFF MIDNIGHT DROP",
    discountPercent: 55,
    productID: 'VT-PROD-04',
    title: 'Tokyo Nightshift Graphic Boxy Tee',
    originalPrice: 1999,
    dealPrice: 899,
    dayIndex: 4,
    tagline: 'Shibuya Night Series High-Density Back Graphic',
  },
];

// Helper to get daily deal video reels, prioritizing today's featured deal
export function getDailyReels(): VideoReelDeal[] {
  const today = new Date().getDay();
  // Rotate array based on current day of week
  const offset = today % DAILY_VIDEO_REELS.length;
  return [...DAILY_VIDEO_REELS.slice(offset), ...DAILY_VIDEO_REELS.slice(0, offset)];
}
