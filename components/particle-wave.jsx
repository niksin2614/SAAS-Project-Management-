"use client";

import { useEffect, useRef } from "react";

export default function ParticleWave({
  className = "",
  speed = 1.0,
  opacity = 1.0,
  interactive = false,
  fadeEdges = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Grid configuration
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const COLS = isMobile ? 42 : 68;
    const ROWS = isMobile ? 40 : 62;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile battery & performance
      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    let time = 0;
    const pitch = 0.44; // Angle looking down at the wave plane
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const FOV = 440;

    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        }
        return;
      }

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      time += prefersReducedMotion ? 0 : 0.016 * speed;

      // Clear with pure transparent canvas (background is black)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = (width * dpr) / 2 + mouseX * 40 * dpr;
      const centerY = (height * dpr) * 0.58 + mouseY * 25 * dpr;

      const spacingX = ((width * 1.55) / COLS) * dpr;
      const spacingZ = ((height * 1.7) / ROWS) * dpr;

      // Draw flowing particle grid
      for (let r = 0; r < ROWS; r++) {
        // Depth factor (0 near, 1 far)
        const depthFrac = r / ROWS;
        const zBase = (r * spacingZ) + 120 * dpr;

        // Path for subtle mesh line across this row
        ctx.beginPath();
        let firstPoint = true;

        for (let c = 0; c < COLS; c++) {
          const colFrac = (c - COLS / 2) / (COLS / 2); // -1 to 1
          const xBase = (c - COLS / 2) * spacingX;

          // Mathematical undulating wave function
          // Superposition of harmonic wave frequencies
          const wave1 = Math.sin(c * 0.18 + time * 1.5) * (42 * dpr);
          const wave2 = Math.cos(r * 0.16 + time * 1.9) * (50 * dpr);
          const wave3 = Math.sin((c * 0.09 + r * 0.12) + time * 1.1) * (28 * dpr);
          const wave4 = Math.sin(colFrac * Math.PI) * Math.cos(depthFrac * Math.PI) * (35 * dpr);

          const yBase = wave1 + wave2 + wave3 + wave4;

          // 3D Rotation along pitch axis
          const rotY = -yBase * cosPitch + zBase * sinPitch;
          const rotZ = yBase * sinPitch + zBase * cosPitch + 180 * dpr;

          if (rotZ <= 10) continue;

          // Perspective projection
          const scale = (FOV * dpr) / rotZ;
          const screenX = centerX + xBase * scale;
          const screenY = centerY + rotY * scale;

          // Edge fading (horizontal and vertical vignettes)
          let edgeFade = 1.0;
          if (fadeEdges) {
            const edgeDistX = Math.abs(screenX - (width * dpr) / 2) / ((width * dpr) / 2);
            const edgeDistY = Math.abs(screenY - (height * dpr) / 2) / ((height * dpr) / 2);
            edgeFade = Math.max(0, 1 - Math.pow(edgeDistX, 2.2)) * Math.max(0, 1 - Math.pow(edgeDistY, 2.8));
          }

          // Depth-based opacity and size
          const depthAlpha = Math.max(0.04, Math.min(0.9, 1.0 - depthFrac * 0.85));
          const finalAlpha = depthAlpha * edgeFade * opacity;

          if (finalAlpha <= 0.01) continue;

          // Add to row line
          if (firstPoint) {
            ctx.moveTo(screenX, screenY);
            firstPoint = false;
          } else {
            ctx.lineTo(screenX, screenY);
          }

          // Draw the glowing particle dot
          const particleRadius = Math.max(0.6 * dpr, Math.min(2.8 * dpr, 2.2 * scale));

          ctx.save();
          // Mix white foreground dots with soft-grey distant dots
          const brightness = Math.floor(190 + (1 - depthFrac) * 65);
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 5}, ${finalAlpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, particleRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Stroke the row connection line faintly
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.015, (1 - depthFrac) * 0.12 * opacity)})`;
        ctx.lineWidth = 0.7 * dpr;
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed, opacity, interactive, fadeEdges]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
