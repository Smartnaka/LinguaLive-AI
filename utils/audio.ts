import { Blob } from '@google/genai';

/**
 * Converts a Float32Array of audio data (PCM) to a Google GenAI Blob
 * formatted as 16-bit PCM, 16kHz.
 */
export function float32To16BitPCM(float32Arr: Float32Array): Blob {
  const int16Arr = new Int16Array(float32Arr.length);
  for (let i = 0; i < float32Arr.length; i++) {
    // Clamp and scale to 16-bit integer range
    const s = Math.max(-1, Math.min(1, float32Arr[i]));
    int16Arr[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Encode to base64
  let binary = '';
  const bytes = new Uint8Array(int16Arr.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return {
    data: base64,
    mimeType: 'audio/pcm;rate=16000',
  };
}

/**
 * Decodes a base64 string (raw PCM 16-bit) into an AudioBuffer.
 */
export function base64ToAudioBuffer(
  base64: string,
  audioContext: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): AudioBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const dataInt16 = new Int16Array(bytes.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Helper to visualize audio volume
 */
export function getVolume(analyzer: AnalyserNode, dataArray: Uint8Array): number {
    analyzer.getByteFrequencyData(dataArray);
    let sum = 0;
    for(let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / dataArray.length;
}

/**
 * Plays a pleasant "ding" sound to confirm user input was received.
 */
export function playFeedbackSound(audioContext: AudioContext) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  
  // A pleasing chime: Starts at 800Hz and quickly drops to 600Hz
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.3);

  // Envelope: Attack -> Decay
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.35);
}