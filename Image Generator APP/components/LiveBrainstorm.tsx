import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

interface LiveBrainstormProps {
  onIdeaAccepted: (idea: string) => void;
  currentPrompt: string;
}

const API_KEY = process.env.API_KEY || '';

// --- Audio Decoding Utilities (as per @google/genai guidelines) ---

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveBrainstorm: React.FC<LiveBrainstormProps> = ({ onIdeaAccepted, currentPrompt }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Start voice brainstorming');

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<Promise<any> | null>(null);
  const transcriptionRef = useRef<string>('');
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const stopSession = useCallback(async (shouldCloseSession = true) => {
    if (shouldCloseSession && sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsActive(false);
    setIsConnecting(false);
    setStatus('Start voice brainstorming');
    sessionRef.current = null;
  }, []);

  const startSession = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Microphone not supported.');
      return;
    }

    setStatus('Connecting...');
    setIsConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      const inputContext = new AudioContextClass({ sampleRate: 16000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      transcriptionRef.current = currentPrompt ? currentPrompt.trim() + ' ' : '';

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Listening... Click to stop.');
            setIsConnecting(false);
            setIsActive(true);

            const source = inputContext.createMediaStreamSource(stream);
            // NOTE: createScriptProcessor is deprecated but used here for broad compatibility.
            // For future development, AudioWorklet is the recommended replacement.
            const processor = inputContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }

              let binary = '';
              const bytes = new Uint8Array(int16.buffer);
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const b64 = btoa(binary);

              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: b64 } });
              });
            };

            source.connect(processor);
            processor.connect(inputContext.destination);
            inputSourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              const audioBytes = decode(audioData);
              const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
              const sourceNode = ctx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(ctx.destination);

              const currentTime = ctx.currentTime;
              const startTime = Math.max(currentTime, nextStartTimeRef.current);
              sourceNode.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
            }

            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              const currentText = transcriptionRef.current.trim();
              if (msg.serverContent.turnComplete) {
                transcriptionRef.current += text;
                onIdeaAccepted(transcriptionRef.current.trim() + ' ');
              } else {
                onIdeaAccepted(currentText + ' ' + text);
              }
            }
          },
          onclose: () => stopSession(false),
          onerror: (e) => {
            console.error(e);
            setStatus('Error. Click to retry.');
            stopSession(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: "You are a creative partner. Listen to the user's ideas for an image and help them formulate a prompt. You can respond with short encouraging phrases.",
        }
      });

      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error("Failed to start live session", e);
      setStatus('Microphone permission may have been denied.');
      setIsConnecting(false);
    }
  }, [currentPrompt, onIdeaAccepted, stopSession]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (isActive || isConnecting) {
        stopSession();
      }
    };
  }, [isActive, isConnecting, stopSession]);

  return (
    <button
      onClick={isActive ? () => stopSession() : startSession}
      title={status}
      disabled={isConnecting}
      className={`p-2 rounded-full transition-all disabled:opacity-50 ${isConnecting
          ? 'bg-yellow-500/20 text-yellow-400'
          : isActive
            ? 'bg-red-500 text-white animate-pulse'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
    >
      {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export default LiveBrainstorm;