import React from 'react';
import { THEMES, useTheme } from '../lib/theme.jsx';

export function ThemeSwitcher() {
  const t = useTheme();
  const keys = Object.keys(THEMES);
  return (
    <div style={{
      position: 'fixed',
      top: 'calc(10px + env(safe-area-inset-top))',
      right: 10, zIndex: 200,
      display: 'flex', gap: 4,
      padding: 4,
      borderRadius: 999,
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      {keys.map(k => (
        <button key={k} onClick={() => t.setTheme(k)} title={THEMES[k].name}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            border: k === t.key ? '2px solid #fff' : '2px solid transparent',
            background: THEMES[k].accent,
            cursor: 'pointer', padding: 0,
          }} />
      ))}
    </div>
  );
}
