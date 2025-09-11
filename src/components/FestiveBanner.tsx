"use client";
import React, { useEffect, useState } from "react";

export default function FestiveBanner() {
  const [offset, setOffset] = useState(-400);
  useEffect(() => {
    let raf: number;
    function animate() {
      setOffset((prev) => (prev > window.innerWidth + 200 ? -400 : prev + 2));
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", height: 70, overflow: "visible", zIndex: 51 }}>
      <div
        style={{
          position: "absolute",
          left: offset,
          top: 0,
          transition: "left 0.1s",
          height: 70,
        }}
      >
        {/* Santa sleigh and reindeer SVG */}
        <svg width="320" height="60" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Santa sleigh */}
          <g>
            <rect x="12" y="42" width="40" height="12" rx="6" fill="#c0392b" />
            <ellipse cx="32" cy="54" rx="20" ry="4" fill="#964B00" opacity=".6" />
            <circle cx="18" cy="48" r="4" fill="#fff" />
            <circle cx="38" cy="46" r="7" fill="#fff" />
            {/* Santa */}
            <circle cx="24" cy="40" r="5" fill="#fff" />
            <circle cx="23" cy="38" r="2" fill="#e74c3c" />
            <rect x="22" y="41" width="4" height="4" rx="2" fill="#e74c3c" />
          </g>
          {/* Reindeer */}
          <g>
            <ellipse cx="70" cy="50" rx="10" ry="5" fill="#8d5524" />
            <ellipse cx="90" cy="50" rx="10" ry="5" fill="#8d5524" />
            <ellipse cx="110" cy="50" rx="10" ry="5" fill="#8d5524" />
            {/* heads */}
            <circle cx="80" cy="43" r="5" fill="#a47149" />
            <circle cx="100" cy="43" r="5" fill="#a47149" />
            <circle cx="120" cy="43" r="5" fill="#a47149" />
            {/* antlers */}
            <path d="M78 38 Q75 33 80 35" stroke="#bfa76f" strokeWidth="2" />
            <path d="M82 38 Q85 33 80 35" stroke="#bfa76f" strokeWidth="2" />
            <path d="M98 38 Q95 33 100 35" stroke="#bfa76f" strokeWidth="2" />
            <path d="M102 38 Q105 33 100 35" stroke="#bfa76f" strokeWidth="2" />
            <path d="M118 38 Q115 33 120 35" stroke="#bfa76f" strokeWidth="2" />
            <path d="M122 38 Q125 33 120 35" stroke="#bfa76f" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
