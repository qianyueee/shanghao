import React from 'react';
import { useTheme, THEMES } from '../lib/theme.jsx';

export function MeSheet({ profile, email, onClose, onSignOut }) {
  const t = useTheme();
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';
  const themeKeys = Object.keys(THEMES);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '85vh',
        background: t.bgGrad || t.bg,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: '14px 20px calc(28px + env(safe-area-inset-bottom))',
        border: isCream ? '1.5px solid #1a1a1a' : 'none',
        borderBottom: 'none',
        overflow: 'auto',
      }}>
        <div style={{
          width: 40, height: 5, borderRadius: 100, background: t.textDim,
          margin: '0 auto 16px',
        }} />

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, lineHeight: 1.2 }}>
          <div style={{ fontFamily: t.font.title, fontSize: 28, color: t.text, lineHeight: 1.1 }}>
            我的
          </div>
          <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em' }}>
            PROFILE
          </div>
        </div>

        {profile && (
          <div style={{
            padding: 16,
            borderRadius: isCream ? 18 : 22,
            background: t.surface,
            border: `1px solid ${t.border}`,
            boxShadow: isCream ? '3px 3px 0 #1a1a1a' : 'none',
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 18,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `oklch(0.6 0.2 ${profile.hue})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: t.font.title, color: '#fff', fontSize: 24,
            }}>{profile.init}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: t.font.body, fontWeight: 600, fontSize: 18, color: t.text }}>
                {profile.name}
              </div>
              {email && (
                <div style={{
                  fontFamily: t.font.mono, fontSize: 11, color: t.textMuted,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{email}</div>
              )}
            </div>
          </div>
        )}

        <div style={{
          fontFamily: t.font.mono, fontSize: 11, letterSpacing: '0.15em',
          color: t.textMuted, marginBottom: 10,
        }}>
          主题 · THEME
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {themeKeys.map(k => {
            const th = THEMES[k];
            const active = k === t.key;
            return (
              <button key={k} onClick={() => t.setTheme(k)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                borderRadius: isCream ? 14 : 16,
                background: active ? (isCyber ? `${th.accent}22` : t.surface) : 'transparent',
                border: active ? `1.5px solid ${th.accent}` : `1px solid ${t.border}`,
                cursor: 'pointer', textAlign: 'left',
                boxShadow: isCream && active ? `3px 3px 0 ${th.accent}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: th.bgGrad || th.bg,
                  border: `1px solid ${th.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: th.accent,
                    boxShadow: `0 0 8px ${th.accent}88`,
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: t.font.body, fontWeight: 600, fontSize: 15, color: t.text }}>
                    {th.name}
                  </div>
                  <div style={{ fontFamily: t.font.mono, fontSize: 10, color: t.textMuted, letterSpacing: '0.1em' }}>
                    {th.tagline}
                  </div>
                </div>
                {active && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5 9-10" stroke={th.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {onSignOut && (
          <button onClick={onSignOut} style={{
            width: '100%', height: 52,
            borderRadius: isCream ? 14 : 999,
            border: `1.5px solid ${t.danger}66`,
            background: 'transparent',
            color: t.danger,
            fontFamily: t.font.title, fontSize: 18,
            cursor: 'pointer',
            boxShadow: isCream ? `3px 3px 0 ${t.danger}` : 'none',
          }}>
            退出登录
          </button>
        )}
      </div>
    </div>
  );
}
