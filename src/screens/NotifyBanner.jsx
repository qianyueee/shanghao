import React, { useEffect, useState } from 'react';
import { useTheme } from '../lib/theme.jsx';
import { Avatar } from '../components/Avatar.jsx';

export function NotifyBanner({ members, onDismiss, onJoin }) {
  const t = useTheme();
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';
  const isCandy = t.key === 'candy';

  const freeMembers = members.filter(m => m.status === 'free');
  const [showing, setShowing] = useState(false);
  useEffect(() => {
    const tmr = setTimeout(() => setShowing(true), 50);
    return () => clearTimeout(tmr);
  }, []);

  const bg = isCyber
    ? `linear-gradient(135deg, ${t.free}ee 0%, ${t.accent2}dd 100%)`
    : (isCandy
        ? `linear-gradient(135deg, ${t.accent} 0%, ${t.accent2} 100%)`
        : (isCream ? '#1a1a1a' : '#fff'));

  const textColor = isCream ? '#fff' : (isCyber ? '#000' : '#1a0a1f');

  return (
    <div style={{
      position: 'fixed', top: 'calc(12px + env(safe-area-inset-top))', left: 10, right: 10, zIndex: 100,
      transform: showing ? 'translateY(0)' : 'translateY(-120%)',
      opacity: showing ? 1 : 0,
      transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s',
    }}>
      <div style={{
        padding: '12px 14px 14px',
        borderRadius: 22,
        background: bg,
        border: isCream ? '1.5px solid #1a1a1a' : 'none',
        boxShadow: isCream
          ? '4px 4px 0 #E8452C, 6px 6px 0 #1a1a1a'
          : (isCyber ? `0 0 40px ${t.free}88, 0 8px 30px rgba(0,0,0,0.5)` : '0 12px 40px rgba(255,77,141,0.5)'),
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: t.font.mono, fontSize: 11, letterSpacing: '0.1em',
          color: textColor, opacity: 0.8, marginBottom: 8,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 5,
            background: textColor, color: bg.includes('gradient') ? '#fff' : t.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.font.title, fontSize: 12,
          }}>号</div>
          <span>上号吗 · 现在</span>
          <div style={{ flex: 1 }} />
          <span onClick={onDismiss} style={{ cursor: 'pointer', padding: 2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </span>
        </div>

        <div style={{
          fontFamily: t.font.title, fontSize: 22, lineHeight: 1.15,
          color: textColor, marginBottom: 10,
        }}>
          凑齐了！<b style={{
            background: isCream ? t.accent : 'rgba(255,255,255,0.35)',
            padding: '0 6px', borderRadius: 6,
          }}>{freeMembers.length}个人</b>都空闲 · 上号？
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <div style={{ display: 'flex' }}>
            {freeMembers.slice(0, 5).map((m, i) => (
              <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 10 - i }}>
                <Avatar member={m} size={30} theme={t} />
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: t.font.body, fontSize: 12, color: textColor, opacity: 0.85,
          }}>
            {freeMembers.slice(0, 3).map(m => m.name).join('、')}
            {freeMembers.length > 3 ? ` 等 ${freeMembers.length} 人` : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onJoin} style={{
            flex: 1, height: 42,
            borderRadius: isCream ? 12 : 999,
            background: textColor,
            color: bg.includes('gradient') ? '#fff' : t.accent,
            border: 'none', cursor: 'pointer',
            fontFamily: t.font.title, fontSize: 18,
          }}>
            我来了 →
          </button>
          <button onClick={onDismiss} style={{
            flex: '0 0 auto', padding: '0 18px', height: 42,
            borderRadius: isCream ? 12 : 999,
            background: 'transparent', color: textColor,
            border: `1.5px solid ${textColor}55`, cursor: 'pointer',
            fontFamily: t.font.body, fontSize: 14, fontWeight: 600,
          }}>
            稍后
          </button>
        </div>
      </div>

      {isCandy && (
        <div style={{
          position: 'absolute', top: -8, right: 22,
          fontSize: 22, transform: 'rotate(20deg)',
        }}>✦</div>
      )}
    </div>
  );
}
