'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, AlertCircle, RefreshCw, Video } from 'lucide-react';

interface LiveCameraFeedProps {
  className?: string;
  overlayLabel?: string;
  showTimer?: boolean;
  onStreamReady?: (stream: MediaStream) => void;
  onStreamError?: (error: string) => void;
}

export default function LiveCameraFeed({
  className = '',
  overlayLabel = 'LIVE',
  showTimer = true,
  onStreamReady,
  onStreamError,
}: LiveCameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer
  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Start Camera
  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by this browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
      onStreamReady?.(mediaStream);
    } catch (err: any) {
      console.warn('Webcam permission error:', err);
      const errMsg = err?.message?.includes('Permission denied')
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : 'Could not access webcam. Make sure your camera is connected and not in use by another app.';
      setError(errMsg);
      setIsLoading(false);
      onStreamError?.(errMsg);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Video Track
  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOff;
        setIsCameraOff(!isCameraOff);
      }
    } else {
      startCamera();
    }
  };

  // Toggle Audio Track
  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  return (
    <div className={`relative bg-slate-950 rounded-xl overflow-hidden shadow-elevated border border-border group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isCameraOff || error || isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white p-6 animate-fade-in">
          <RefreshCw size={32} className="animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold">Requesting camera access…</p>
          <p className="text-xs text-white/60 mt-1">Please allow camera permissions in your browser</p>
        </div>
      )}

      {/* Error Fallback */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-negative/20 border border-negative/40 flex items-center justify-center mb-3">
            <AlertCircle size={24} className="text-negative" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Camera Offline</p>
          <p className="text-xs text-white/60 max-w-xs mb-4 leading-relaxed">{error}</p>
          <button
            onClick={startCamera}
            className="btn-primary text-xs px-4 py-2 hover-pop"
          >
            <RefreshCw size={14} /> Retry Camera
          </button>
        </div>
      )}

      {/* Camera Off Overlay */}
      {isCameraOff && !error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white/50 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <CameraOff size={28} />
          </div>
          <p className="text-sm font-medium">Camera is disabled</p>
        </div>
      )}

      {/* Live Badge & Timer Overlay */}
      {!isLoading && !error && (
        <>
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-negative/90 backdrop-blur-md border border-white/20 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-white text-xs font-bold tracking-wider">{overlayLabel}</span>
          </div>

          {showTimer && (
            <div className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 font-mono text-xs font-semibold text-white">
              {formatTime(elapsedSeconds)}
            </div>
          )}
        </>
      )}

      {/* Floating Control Bar */}
      {!isLoading && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-lg transition-transform duration-200 group-hover:scale-105">
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all duration-200 ${
              isMuted
                ? 'bg-negative text-white'
                : 'bg-white/15 text-white hover:bg-white/30'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            className={`p-2 rounded-full transition-all duration-200 ${
              isCameraOff
                ? 'bg-negative text-white'
                : 'bg-white/15 text-white hover:bg-white/30'
            }`}
            title={isCameraOff ? 'Enable camera' : 'Disable camera'}
          >
            {isCameraOff ? <CameraOff size={15} /> : <Camera size={15} />}
          </button>
        </div>
      )}
    </div>
  );
}
