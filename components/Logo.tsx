import React from 'react';

export const Logo = () => (
  <svg
    width="200"
    height="120"
    viewBox="0 0 200 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="AgriSentry Logo Icon"
  >
    <defs>
      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#84cc16', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#4d7c0f', stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    <g transform="translate(20, 0)">
      {/* Shadow */}
      <ellipse cx="65" cy="100" rx="40" ry="5" fill="rgba(0,0,0,0.2)" />

      {/* Legs */}
      <rect x="55" y="90" width="8" height="15" fill="#4d7c0f" rx="4" />
      <rect x="75" y="90" width="8" height="15" fill="#4d7c0f" rx="4" />

      {/* Leaf Body */}
      <path
        d="M65,10 C25,30 20,80 65,100 C110,80 115,30 65,10 Z"
        transform="rotate(-15 65 55)"
        fill="url(#leafGradient)"
        stroke="#365314"
        strokeWidth="2"
      />
      
      {/* Leaf Vein */}
      <path
        d="M65,98 C80,70 85,40 67,12"
        transform="rotate(-15 65 55)"
        stroke="#a3e635"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Face */}
      <g transform="rotate(-15 65 55) translate(0, 5)">
        {/* Cheeks */}
        <ellipse cx="50" cy="68" rx="5" ry="3" fill="rgba(251, 146, 159, 0.7)" />
        <ellipse cx="80" cy="68" rx="5" ry="3" fill="rgba(251, 146, 159, 0.7)" />
        
        {/* Eyes */}
        <circle cx="58" cy="60" r="4" fill="#365314" />
        <circle cx="72" cy="60" r="4" fill="#365314" />

        {/* Mouth */}
        <path d="M58,72 Q65,78 72,72" stroke="#365314" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </g>
    
    {/* Checkmark */}
    <g transform="translate(130, 30)">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#4d7c0f" strokeWidth="3" />
        <path d="M15,25 L23,33 L35,17" stroke="#4d7c0f" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>

  </svg>
);
