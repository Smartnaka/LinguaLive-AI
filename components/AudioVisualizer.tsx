import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  volume: number; // 0-255
  isActive: boolean;
  isAiSpeaking: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume, isActive, isAiSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
        // Adjust canvas size
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;

        if (!isActive) {
            // Idle state - gentle pulse (Green)
            const radius = 40 + Math.sin(Date.now() / 1000) * 5;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 184, 74, 0.3)'; // Primary Green light
            ctx.lineWidth = 2;
            ctx.stroke();
            return;
        }

        // Active State - Waveform based on volume
        // If AI is speaking, we use a different scale and visual style
        const volumeScale = isAiSpeaking ? 1.2 : 1.5;
        const normalizedVol = Math.min(volume / 100, volumeScale);
        
        // Base radius fluctuates slightly
        const baseRadius = 50 + (normalizedVol * 10);
        
        // Setup gradients
        let fillStyle1, fillStyle2, fillStyle3;

        if (isAiSpeaking) {
           // Gemini Gradient Colors (Blue/Purple/Pink)
           fillStyle1 = 'rgba(66, 133, 244, 0.4)'; // Blue
           fillStyle2 = 'rgba(156, 39, 176, 0.4)'; // Purple
           fillStyle3 = 'rgba(233, 30, 99, 0.4)';  // Pink
        } else {
           // User Speaking (Green/Teal/Lime)
           fillStyle1 = 'rgba(0, 184, 74, 0.4)';   // Primary Green
           fillStyle2 = 'rgba(132, 204, 22, 0.4)'; // Lime
           fillStyle3 = 'rgba(20, 184, 166, 0.4)'; // Teal
        }
        
        // Create multiple blobs
        for (let i = 0; i < 3; i++) {
             ctx.beginPath();
             const offset = (Math.PI * 2 / 3) * i;
             
             // Speed is slower for AI to feel more "thoughtful/composed"
             const speed = isAiSpeaking ? 2 : 5;
             const variance = isAiSpeaking ? 25 : 30;

             for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
                 const noise = Math.sin(angle * speed + phase + offset) * (normalizedVol * variance);
                 const r = baseRadius + noise;
                 const x = centerX + Math.cos(angle) * r;
                 const y = centerY + Math.sin(angle) * r;
                 
                 if (angle === 0) ctx.moveTo(x, y);
                 else ctx.lineTo(x, y);
             }
             ctx.closePath();
             
             if (i === 0) ctx.fillStyle = fillStyle1;
             if (i === 1) ctx.fillStyle = fillStyle2;
             if (i === 2) ctx.fillStyle = fillStyle3;
             
             ctx.fill();
        }
        
        // Increment phase
        phase += isAiSpeaking ? 0.05 : 0.1;
        animationId = requestAnimationFrame(render);
    };

    if (isActive) {
        render();
    } else {
        // Draw one frame of idle
        render();
        cancelAnimationFrame(animationId!);
    }

    return () => {
        if (animationId) cancelAnimationFrame(animationId);
    };
  }, [volume, isActive, isAiSpeaking]);

  return (
    <canvas 
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full max-w-[400px] h-auto aspect-square mx-auto transition-all duration-1000 ease-in-out"
    />
  );
};

export default AudioVisualizer;