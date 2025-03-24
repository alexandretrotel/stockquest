"use client";

import { CONFETTI_ANIMATION_DURATION, CONFETTI_NUMBER } from "@/data/settings";
import { useEffect, useState } from "react";

interface ConfettiProps {
  count?: number;
  duration?: number;
}

export default function Confetti({
  count = CONFETTI_NUMBER,
  duration = CONFETTI_ANIMATION_DURATION,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<
    Array<{ id: number; color: string; left: string; delay: string }>
  >([]);

  useEffect(() => {
    const colors = ["#2E7D32", "#F9A825", "#D32F2F", "#1976D2", "#5E35B1"];
    const newPieces = [];

    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
      });
    }

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [count, duration]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            backgroundColor: piece.color,
            left: piece.left,
            top: "-20px",
            animationDelay: piece.delay,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
