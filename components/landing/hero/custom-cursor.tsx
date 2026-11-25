"use client";

import React, { useEffect, useState, useRef } from "react";

export function CustomCursor({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const isDesktopPointer = window.innerWidth >= 768 && !("ontouchstart" in window);
    setIsFinePointer(media.matches || isDesktopPointer);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches || isDesktopPointer);
    };
    media.addEventListener("change", handleMediaChange);

    const container = containerRef.current || document.body;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let hasMoved = false;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        currentX = e.clientX;
        currentY = e.clientY;
        hasMoved = true;
      }
      setIsInside(true);
    };

    const handleMouseLeave = () => {
      setIsInside(false);
    };

    const handleMouseEnter = () => {
      setIsInside(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);

    const render = () => {
      animId = requestAnimationFrame(render);
      // Smooth lerp lag factor (0.18)
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      media.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [containerRef, isInside]);

  if (!mounted || !isFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 will-change-transform transition-opacity duration-300 ${
        isInside ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
      aria-hidden="true"
    >
      {/* Precision Arrowhead Pointer matching Image 1 & Image 2 */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_12px_rgba(124,58,237,0.55)]"
      >
        <path
          d="M4.5 3.5L19.5 11.5L11.5 13.5L8.5 20.5L4.5 3.5Z"
          fill="#8B5CF6"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default CustomCursor;
