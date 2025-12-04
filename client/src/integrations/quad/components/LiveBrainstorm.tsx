import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Loader2 } from 'lucide-react';

interface LiveBrainstormProps {
  onIdeaAccepted: (idea: string) => void;
  currentPrompt: string;
}

const LiveBrainstorm: React.FC<LiveBrainstormProps> = ({ onIdeaAccepted, currentPrompt }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Start voice brainstorming');

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptionRef = useRef<string>('');

  const stopSession = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsActive(false);
    setIsConnecting(false);
    setStatus('Start voice brainstorming');
  }, []);

  const startSession = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Microphone not supported.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('Speech recognition not supported in this browser.');
      return;
    }

    setStatus('Connecting...');
    setIsConnecting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      transcriptionRef.current = currentPrompt ? currentPrompt.trim() + ' ' : '';

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('Listening... Click to stop.');
        setIsConnecting(false);
        setIsActive(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          transcriptionRef.current += finalTranscript;
          onIdeaAccepted(transcriptionRef.current.trim());
        } else if (interimTranscript) {
          onIdeaAccepted((transcriptionRef.current + interimTranscript).trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setStatus('Error. Click to retry.');
        stopSession();
      };

      recognition.onend = () => {
        if (isActive) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (e) {
      console.error("Failed to start voice session", e);
      setStatus('Microphone permission may have been denied.');
      setIsConnecting(false);
    }
  }, [currentPrompt, onIdeaAccepted, stopSession, isActive]);

  useEffect(() => {
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
