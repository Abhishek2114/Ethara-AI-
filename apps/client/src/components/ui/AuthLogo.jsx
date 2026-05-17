import React from "react";
import { brand } from "../../config/brand";

export default function AuthLogo({ className = "", size = "md", iconOnly = false }) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Futuristic Monogram */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
        >
          {/* Glowing Gradient Backdrop Orb */}
          <circle cx="50" cy="50" r="45" fill="url(#bg-gradient)" opacity="0.12" />
          
          {/* Orbital Hex / Cyber Ring */}
          <path
            d="M50 8L86 29V71L50 92L14 71V29L50 8Z"
            stroke="url(#stroke-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />

          {/* Sleek Glowing Abstract Interlocking "A" */}
          <path
            d="M50 16L80 76H64L50 48L36 76H20L50 16Z"
            fill="url(#brand-accent-gradient)"
          />
          <path
            d="M32 60H68"
            stroke="url(#stroke-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="bg-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="stroke-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <linearGradient id="brand-accent-gradient" x1="50" y1="16" x2="50" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#09A3AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Styled Display Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            Astral<span className="text-primary">HQ</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mt-1">
            BY {brand.company.split(" ")[0]}
          </span>
        </div>
      )}
    </div>
  );
}
