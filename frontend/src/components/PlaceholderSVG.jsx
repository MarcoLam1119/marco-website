import React from "react";

export default function PlaceholderSVG({ i = 0 }) {
  const hue = (i * 47) % 360;
  const id = `g${i}`;
  return (
    <svg
      width="100%"
      height="140"
      viewBox="0 0 400 140"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Placeholder image"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0%" stopColor={`hsl(${hue},70%,60%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 60) % 360},70%,60%)`} />
        </linearGradient>
      </defs>
      <rect width="400" height="140" fill={`url(#${id})`} />
      <g fill="rgba(255,255,255,.75)">
        <circle cx="70" cy="70" r="32" />
        <rect x="130" y="54" width="220" height="16" rx="8" />
        <rect x="130" y="78" width="180" height="12" rx="6" />
      </g>
    </svg>
  );
}