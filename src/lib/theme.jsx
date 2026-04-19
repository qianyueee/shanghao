import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = {
  cyber: {
    name: '赛博荧光',
    dark: true,
    bg: '#0A0A0F',
    bgGrad: 'radial-gradient(ellipse at top, #1a0f2e 0%, #0A0A0F 60%)',
    surface: 'rgba(255,255,255,0.04)',
    surfaceSolid: '#13131A',
    border: 'rgba(255,255,255,0.08)',
    text: '#F5F5FF',
    textMuted: 'rgba(245,245,255,0.55)',
    textDim: 'rgba(245,245,255,0.35)',
    accent: '#00FF88',
    accent2: '#B84DFF',
    accent3: '#FFD84D',
    danger: '#FF3366',
    free: '#00FF88',
    busy: '#B84DFF',
    sleep: '#5B6EE8',
    custom: '#FFD84D',
    font: {
      display: "'Space Grotesk', 'Noto Sans SC', sans-serif",
      title: "'ZCOOL KuaiLe', 'Noto Sans SC', sans-serif",
      body: "'Space Grotesk', 'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    shadow: '0 20px 60px rgba(184,77,255,0.12), 0 0 0 1px rgba(255,255,255,0.04)',
    cardRadius: 24,
    tagline: 'READY TO GAME',
  },
  candy: {
    name: '糖果波普',
    dark: false,
    bg: '#FFF4E0',
    bgGrad: 'linear-gradient(180deg, #FFE9A8 0%, #FFF4E0 40%, #FFDCE8 100%)',
    surface: '#fff',
    surfaceSolid: '#fff',
    border: 'rgba(0,0,0,0.08)',
    text: '#1a0a1f',
    textMuted: 'rgba(26,10,31,0.62)',
    textDim: 'rgba(26,10,31,0.42)',
    accent: '#FF4D8D',
    accent2: '#FFB547',
    accent3: '#5EC5FF',
    danger: '#FF3366',
    free: '#00C853',
    busy: '#FF4D8D',
    sleep: '#7C5CFF',
    custom: '#FFB547',
    font: {
      display: "'Space Grotesk', 'Noto Sans SC', sans-serif",
      title: "'ZCOOL KuaiLe', 'Noto Sans SC', sans-serif",
      body: "'Space Grotesk', 'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    shadow: '0 12px 40px rgba(255,77,141,0.18), 0 0 0 1.5px #1a0a1f',
    cardRadius: 28,
    tagline: "LET'S PLAY",
  },
  cream: {
    name: '奶油Y2K',
    dark: false,
    bg: '#F3EBDA',
    bgGrad: 'linear-gradient(180deg, #F3EBDA 0%, #EFE4CC 100%)',
    surface: '#FBF6EA',
    surfaceSolid: '#FBF6EA',
    border: '#1a1a1a',
    text: '#1a1a1a',
    textMuted: 'rgba(26,26,26,0.65)',
    textDim: 'rgba(26,26,26,0.4)',
    accent: '#E8452C',
    accent2: '#3350D8',
    accent3: '#F5C518',
    danger: '#E8452C',
    free: '#2E8540',
    busy: '#E8452C',
    sleep: '#3350D8',
    custom: '#F5C518',
    font: {
      display: "'Space Grotesk', 'Noto Sans SC', sans-serif",
      title: "'ZCOOL KuaiLe', 'Noto Sans SC', sans-serif",
      body: "'Space Grotesk', 'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    shadow: '4px 4px 0 #1a1a1a, 0 0 0 1.5px #1a1a1a',
    cardRadius: 20,
    tagline: 'GAME ON',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [name, setName] = useState(() => localStorage.getItem('shanghao_theme') || 'cyber');

  useEffect(() => {
    localStorage.setItem('shanghao_theme', name);
  }, [name]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '1') setName('cyber');
      if (e.key === '2') setName('candy');
      if (e.key === '3') setName('cream');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = { ...THEMES[name], key: name, setTheme: setName };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function StatusIcon({ status, size = 18, color = 'currentColor' }) {
  if (status === 'free') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill={color}/>
      </svg>
    );
  }
  if (status === 'busy') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color}/>
        <rect x="7" y="11" width="10" height="2" rx="1" fill="#fff"/>
      </svg>
    );
  }
  if (status === 'sleep') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" fill={color}/>
      </svg>
    );
  }
  if (status === 'offline') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill={color}/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" fill={color}/>
    </svg>
  );
}
