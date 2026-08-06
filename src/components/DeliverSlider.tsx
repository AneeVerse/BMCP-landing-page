"use client";

import React, { useRef, useEffect, useState } from "react";

const row1Images = [
  "Frame 12.png",
  "Frame 13.png",
  "Frame 14.png",
  "Frame 15.png",
  "Frame 16.png",
  "Frame 17.png",
  "Frame 18.png",
  "Frame 19.png",
];

const row2Images = [
  "Frame 20.png",
  "Frame 22.png",
  "Frame 24.png",
  "Frame 27.png",
  "Frame 28.png",
  "Frame 29.png",
  "Frame 30.png",
  "Frame 12.png",
];

interface SliderRowProps {
  images: string[];
  direction: "left" | "right";
  speed?: number;
}

function SliderRow({ images, direction, speed = 0.8 }: SliderRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Duplicating 3 times allows smooth infinite resetting
  const displayImages = [...images, ...images, ...images];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize right-scrolling row near the middle
    if (direction === "right" && container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 3;
    }

    let animationId: number;

    const scroll = () => {
      if (container && !isHovered && !isDragging) {
        const oneThird = container.scrollWidth / 3;
        
        if (direction === "left") {
          container.scrollLeft += speed;
          if (container.scrollLeft >= oneThird * 2) {
            container.scrollLeft -= oneThird;
          }
        } else {
          container.scrollLeft -= speed;
          if (container.scrollLeft <= 0) {
            container.scrollLeft += oneThird;
          }
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [direction, speed, isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    setIsDragging(true);
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        display: "flex",
        gap: "18px",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        padding: "20px 0",
      }}
      className="slider-row-scroll"
    >
      {displayImages.map((img, idx) => (
        <div
          key={idx}
          style={{
            flex: "0 0 auto",
            width: "clamp(260px, 28vw, 360px)",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, boxShadow 0.3s ease",
            background: "#fff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
            e.currentTarget.style.boxShadow = "0 10px 26px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)";
          }}
        >
          <img
            src={`/images/web sliders/${encodeURIComponent(img)}`}
            alt={`Corporate Deliverable ${idx + 1}`}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              pointerEvents: "none",
            }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default function DeliverSlider() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0px" }}>
      <style>{`
        .slider-row-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <SliderRow images={row1Images} direction="left" speed={0.8} />
      <SliderRow images={row2Images} direction="right" speed={0.8} />
    </div>
  );
}
