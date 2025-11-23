import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  MODEL_NAME, 
  INPUT_SAMPLE_RATE, 
  OUTPUT_SAMPLE_RATE, 
  BUFFER_SIZE,
  LANGUAGES
} from '../constants';
import { float32To16BitPCM, base64ToAudioBuffer, playFeedbackSound } from '../utils/audio';
import { ConnectionState, LiveConfig, Message } from '../types';

interface UseGeminiLiveProps {
  config: LiveConfig;
}

export const useGeminiLive = ({ config }: UseGeminiLiveProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [volume, setVolume] = useState<number>(0); // For visualizer (0-100)
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  
  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  // Stream Refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  
  // Session Refs
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const userHasSpokenRef = useRef<boolean>(false);
  
  // Transcription buffering
  const currentInputRef = useRef<string>('');
  const currentOutputRef = useRef<string>('');

  // Cleanup function
  const disconnect = useCallback(() => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
          try {
             // @ts-ignore
             session.close?.(); 
          } catch (e) {
             console.warn("Session close error", e);
          }
      });
      sessionPromiseRef.current = null;
    }

    // Stop input processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Stop output sources
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    setIsAiSpeaking(false);
    userHasSpokenRef.current = false;

    // Close contexts
    if (inputAudioContextRef.current?.state !== 'closed') {
      inputAudioContextRef.current?.close();
    }
    if (outputAudioContextRef.current?.state !== 'closed') {
      outputAudioContextRef.current?.close();
    }
    
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    setConnectionState('disconnected');
  }, []);

  const connect = useCallback(async () => {
    if (connectionState === 'connected' || connectionState === 'connecting') return;
    
    setConnectionState('connecting');
    setMessages([]); // Clear chat on new session
    setIsAiSpeaking(false);
    userHasSpokenRef.current = false;

    try {
      // 1. Setup Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ 
        sampleRate: INPUT_SAMPLE_RATE 
      });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ 
        sampleRate: OUTPUT_SAMPLE_RATE 
      });
      
      outputNodeRef.current = outputAudioContextRef.current.createGain();
      outputNodeRef.current.connect(outputAudioContextRef.current.destination);
      
      // Analyzer for visualization
      analyzerRef.current = outputAudioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      outputNodeRef.current.connect(analyzerRef.current);

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 3. Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const selectedLang = LANGUAGES.find(l => l.value === config.language);
      const sysInstruction = selectedLang 
        ? selectedLang.prompt 
        : 'You are a helpful language tutor.';

      // 4. Connect to Live API
      sessionPromiseRef.current = ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voice } }
          },
          systemInstruction: sysInstruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setConnectionState('connected');
            
            // Setup Input Processing inside onopen
            if (!inputAudioContextRef.current || !mediaStreamRef.current) return;
            
            inputSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            processorRef.current = inputAudioContextRef.current.createScriptProcessor(BUFFER_SIZE, 1, 1);
            
            processorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Calculate RMS to detect if user is speaking
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                  sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              
              // Threshold for speech detection (avoid silence triggering)
              if (rms > 0.02) { 
                  userHasSpokenRef.current = true;
              }

              const pcmBlob = float32To16BitPCM(inputData);
              
              // Send to model
              if (sessionPromiseRef.current) {
                  sessionPromiseRef.current.then(session => {
                      session.sendRealtimeInput({ media: pcmBlob });
                  });
              }
            };
            
            inputSourceRef.current.connect(processorRef.current);
            processorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio
            const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioBase64 && outputAudioContextRef.current && outputNodeRef.current) {
                // If this is the start of a new model turn (first chunk), play feedback sound
                // We use a local check plus state setter to ensure UI updates
                if (userHasSpokenRef.current) {
                   playFeedbackSound(outputAudioContextRef.current);
                   userHasSpokenRef.current = false; // Reset
                   setIsAiSpeaking(true);
                } else {
                   // Continue sustaining speaking state if receiving chunks
                   setIsAiSpeaking(true);
                }

                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = base64ToAudioBuffer(audioBase64, ctx, OUTPUT_SAMPLE_RATE);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNodeRef.current);
                
                source.onended = () => {
                   sourcesRef.current.delete(source);
                   if (sourcesRef.current.size === 0) {
                       // Small delay to prevent flickering if next chunk comes fast
                       setTimeout(() => {
                           if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
                       }, 200);
                   }
                };
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
            }
            
            // Handle Interruption
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(src => src.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsAiSpeaking(false);
            }

            // Handle Transcription
            const inputTxt = message.serverContent?.inputTranscription?.text;
            if (inputTxt) {
                currentInputRef.current += inputTxt;
            }
            
            const outputTxt = message.serverContent?.outputTranscription?.text;
            if (outputTxt) {
                currentOutputRef.current += outputTxt;
            }

            // Turn Complete - Commit transcripts
            if (message.serverContent?.turnComplete) {
                 // We rely on audio onended to clear speaking state, but this is a failsafe
                 if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
                 
                 if (currentInputRef.current.trim()) {
                     const userMsg: Message = {
                         id: Date.now() + '-user',
                         role: 'user',
                         text: currentInputRef.current,
                         timestamp: new Date()
                     };
                     setMessages(prev => [...prev, userMsg]);
                     currentInputRef.current = '';
                 }
                 if (currentOutputRef.current.trim()) {
                     const modelMsg: Message = {
                         id: Date.now() + '-model',
                         role: 'model',
                         text: currentOutputRef.current,
                         timestamp: new Date()
                     };
                     setMessages(prev => [...prev, modelMsg]);
                     currentOutputRef.current = '';
                 }
            }
          },
          onclose: () => {
            setConnectionState('disconnected');
            setIsAiSpeaking(false);
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setConnectionState('error');
            disconnect();
          }
        }
      });

    } catch (error) {
      console.error("Connection failed", error);
      setConnectionState('error');
      disconnect();
    }
  }, [config, connectionState, disconnect]);

  // Visualizer loop
  useEffect(() => {
    let animationFrameId: number;
    const updateVolume = () => {
        if (analyzerRef.current && connectionState === 'connected') {
            const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
            analyzerRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setVolume(avg); // 0 to 255
        } else {
            setVolume(0);
        }
        animationFrameId = requestAnimationFrame(updateVolume);
    };
    updateVolume();
    return () => cancelAnimationFrame(animationFrameId);
  }, [connectionState]);

  return {
    connect,
    disconnect,
    connectionState,
    messages,
    volume,
    isAiSpeaking
  };
};