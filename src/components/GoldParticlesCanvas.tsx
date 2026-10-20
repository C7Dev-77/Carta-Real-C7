import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  isBokeh: boolean;
  speedY: number;
  speedX: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleAngle: number;
  color: string;
}

const GOLD_PALETTE = [
  '255, 215, 0',
  '255, 236, 158',
  '212, 175, 55',
  '255, 195, 77',
];

export function GoldParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const createParticle = (initial = false): Particle => {
      const isBokeh = Math.random() < 0.22;
      return {
        x: Math.random() * canvas.width,
        y: initial ? Math.random() * canvas.height : -15,
        radius: isBokeh ? Math.random() * 5 + 2.5 : Math.random() * 1.8 + 0.6,
        isBokeh,
        speedY: Math.random() * 0.45 + 0.15,
        speedX: (Math.random() - 0.5) * 0.35,
        alpha: isBokeh ? Math.random() * 0.35 + 0.1 : Math.random() * 0.75 + 0.25,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinkleAngle: Math.random() * Math.PI * 2,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
      };
    };

    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = window.innerWidth < 768 ? 70 : 135;
      particles = Array.from({ length: count }, () => createParticle(true));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.twinkleAngle) * 0.15;
        p.twinkleAngle += p.twinkleSpeed;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0) {
          p.x += (dx / dist) * 0.45;
          p.y += (dy / dist) * 0.45;
        }

        if (p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
          const resetP = createParticle(false);
          particles[i] = resetP;
          continue;
        }

        const currentAlpha = Math.max(
          0.08,
          Math.min(1, p.alpha + Math.sin(p.twinkleAngle) * 0.22)
        );

        ctx.save();
        ctx.beginPath();

        if (p.isBokeh) {
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius * 2.2
          );
          grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
          grad.addColorStop(0.5, `rgba(${p.color}, ${currentAlpha * 0.4})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
}
