import { useEffect, useState } from "react";

// Tiny static background stars — purely decorative, not catchable
const generateBgStars = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

const FallingBackground = () => {
  const [bgStars] = useState(() => generateBgStars(80));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, #1a0035 0%, #0a0015 50%, #000008 100%)",
        }}
      />

      {/* Static twinkling stars */}
      {bgStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Nebula blobs for atmosphere */}
      <div
        className="absolute rounded-full opacity-10 blur-3xl"
        style={{
          width: "600px",
          height: "600px",
          top: "-100px",
          left: "-100px",
          background: "radial-gradient(circle, #b11a70, transparent)",
        }}
      />
      <div
        className="absolute rounded-full opacity-10 blur-3xl"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-80px",
          right: "-80px",
          background: "radial-gradient(circle, #4a0080, transparent)",
        }}
      />
    </div>
  );
};

export default FallingBackground;