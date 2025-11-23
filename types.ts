export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German',
  JAPANESE = 'Japanese',
  MANDARIN = 'Mandarin Chinese',
  ITALIAN = 'Italian',
  KOREAN = 'Korean'
}

export enum VoiceName {
  PUCK = 'Puck',
  CHARON = 'Charon',
  KORE = 'Kore',
  FENRIR = 'Fenrir',
  ZEPHYR = 'Zephyr'
}

export interface LiveConfig {
  language: Language;
  voice: VoiceName;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SessionData {
  id: string;
  timestamp: string;
  language: Language;
  messages: Message[];
}