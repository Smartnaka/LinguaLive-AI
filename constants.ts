import { Language, VoiceName } from "./types";

export const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

// Audio constants
export const INPUT_SAMPLE_RATE = 16000;
export const OUTPUT_SAMPLE_RATE = 24000;
export const BUFFER_SIZE = 4096;

export const LANGUAGES = [
  { value: Language.ENGLISH, label: '🇺🇸 English', prompt: 'You are a helpful English tutor. Speak clearly and correct my mistakes gently.' },
  { value: Language.SPANISH, label: '🇪🇸 Spanish', prompt: 'You are a native Spanish tutor. Converse in Spanish, help me with vocabulary and grammar.' },
  { value: Language.FRENCH, label: '🇫🇷 French', prompt: 'You are a Parisian French tutor. Help me practice my pronunciation and conversational skills.' },
  { value: Language.GERMAN, label: '🇩🇪 German', prompt: 'You are a friendly German tutor. Speak standard German and explain complex grammar simply.' },
  { value: Language.JAPANESE, label: '🇯🇵 Japanese', prompt: 'You are a Japanese language partner. Speak polite Japanese (Desu/Masu) and help me practice daily conversation.' },
  { value: Language.MANDARIN, label: '🇨🇳 Mandarin', prompt: 'You are a Mandarin Chinese tutor. Help me with tones and phrasing.' },
  { value: Language.ITALIAN, label: '🇮🇹 Italian', prompt: 'You are an enthusiastic Italian tutor. Converse about food, culture, and daily life.' },
  { value: Language.KOREAN, label: '🇰🇷 Korean', prompt: 'You are a Korean language buddy. Help me practice both formal and informal speech patterns.' },
];

export const VOICES = [
  { value: VoiceName.KORE, label: 'Kore (Balanced)' },
  { value: VoiceName.PUCK, label: 'Puck (Playful)' },
  { value: VoiceName.CHARON, label: 'Charon (Deep)' },
  { value: VoiceName.FENRIR, label: 'Fenrir (Intense)' },
  { value: VoiceName.ZEPHYR, label: 'Zephyr (Calm)' },
];
