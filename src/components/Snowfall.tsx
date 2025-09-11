"use client";
import React, { useEffect, useRef } from "react";

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Snowflake properties
    const snowflakes = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1.5,
      d: Math.random() * 1 + 0.5
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#fff";
      snowflakes.forEach(snow => {
        ctx.beginPath();
        ctx.arc(snow.x, snow.y, snow.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    function update() {
      for (let i = 0; i < snowflakes.length; i++) {
        const s = snowflakes[i];
        s.y += s.d;
        s.x += Math.sin(s.y / 30) * 0.5;
        if (s.y > height) {
          s.y = -5;
          s.x = Math.random() * width;
        }
      }
    }

    function animate() {
      draw();
      update();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />
  );
}
