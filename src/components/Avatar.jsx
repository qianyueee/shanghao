import React from 'react';

export function Avatar({ member, size = 44, theme, ring = false, ringColor }) {
  const bg = `oklch(0.72 0.18 ${member.hue})`;
  const bg2 = `oklch(0.55 0.22 ${member.hue})`;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${bg} 0%, ${bg2} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: theme?.font?.title || "'ZCOOL KuaiLe', sans-serif",
      fontSize: size * 0.44, color: '#fff',
      boxShadow: ring ? `0 0 0 3px ${theme.bg}, 0 0 0 ${3 + 2.5}px ${ringColor || theme.accent}` : 'none',
      flexShrink: 0,
      position: 'relative',
    }}>
      {member.init}
    </div>
  );
}
