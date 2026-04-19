import React, { useState } from 'react';
import { useTheme, StatusIcon } from '../lib/theme.jsx';

export function StatusSheet({ me, onClose, onSave }) {
  const t = useTheme();
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';

  const [status, setStatus] = useState(me.status);
  const [until, setUntil] = useState(me.until || 60);
  const [note, setNote] = useState(me.note || '');

  const options = [
    { key: 'free',   zh: '上号!',  en: 'FREE',   desc: '可以马上开黑', color: t.free },
    { key: 'busy',   zh: '忙着',   en: 'BUSY',   desc: '别打扰',       color: t.busy },
    { key: 'sleep',  zh: '睡了',   en: 'SLEEP',  desc: '已躺平',       color: t.sleep },
    { key: 'custom', zh: '自定义', en: 'CUSTOM', desc: '写点别的',     color: t.custom },
  ];

  const durations = [15, 30, 60, 120, 240];

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
            我现在是…
          </div>
          <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em' }}>
            SET STATUS
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {options.map(o => {
            const active = status === o.key;
            return (
              <div key={o.key} onClick={() => setStatus(o.key)} style={{
                padding: '14px 14px',
                borderRadius: isCream ? 16 : 18,
                background: active
                  ? (isCyber ? `${o.color}22` : o.color)
                  : t.surface,
                border: isCream ? `1.5px solid #1a1a1a` : `1.5px solid ${active ? o.color : t.border}`,
                boxShadow: isCream ? (active ? `4px 4px 0 ${o.color}` : '2px 2px 0 rgba(0,0,0,0.12)') : (isCyber && active ? `0 0 16px ${o.color}55` : 'none'),
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <StatusIcon status={o.key} size={20}
                    color={active ? (isCyber ? o.color : (isCream ? '#fff' : o.color)) : o.color} />
                  <div style={{ fontFamily: t.font.mono, fontSize: 10, letterSpacing: '0.12em',
                    color: active ? (isCream ? '#fff' : t.textMuted) : t.textMuted }}>
                    {o.en}
                  </div>
                </div>
                <div style={{
                  fontFamily: t.font.title, fontSize: 26, lineHeight: 1,
                  color: active ? (isCyber ? o.color : (isCream ? '#fff' : (t.key === 'candy' ? '#fff' : o.color))) : t.text,
                  marginBottom: 3,
                  textShadow: isCyber && active ? `0 0 8px ${o.color}88` : 'none',
                }}>{o.zh}</div>
                <div style={{ fontSize: 11, color: active ? (isCream ? 'rgba(255,255,255,0.85)' : t.textMuted) : t.textMuted }}>
                  {o.desc}
                </div>
              </div>
            );
          })}
        </div>

        {(status === 'free' || status === 'custom') && (
          <>
            <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em', marginBottom: 10 }}>
              持续时长 · DURATION
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {durations.map(d => {
                const active = until === d;
                return (
                  <div key={d} onClick={() => setUntil(d)} style={{
                    padding: '10px 16px', borderRadius: 999,
                    background: active ? t.accent : t.surface,
                    border: `1.5px solid ${active ? t.accent : t.border}`,
                    color: active ? (isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f')) : t.text,
                    fontFamily: t.font.body, fontSize: 14, fontWeight: 600,
                    boxShadow: isCream && active ? '2px 2px 0 #1a1a1a' : 'none',
                    cursor: 'pointer',
                  }}>
                    {d < 60 ? `${d}分钟` : `${d/60}小时`}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em', marginBottom: 10 }}>
          留言 · OPTIONAL
        </div>
        <div style={{
          padding: '14px 16px',
          borderRadius: 16,
          background: t.surface,
          border: `1.5px solid ${t.border}`,
          marginBottom: 22,
          boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
        }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={status === 'custom' ? '比如：吃饭中 🍜' : '来把排位 / 等等我 / 速来…'}
            style={{
              width: '100%', border: 'none', outline: 'none',
              background: 'transparent',
              fontFamily: t.font.body, fontSize: 16, color: t.text,
            }}
          />
        </div>

        <button onClick={() => onSave({ status, until, note })} style={{
          width: '100%', height: 58,
          borderRadius: isCream ? 16 : 999,
          border: isCream ? '1.5px solid #1a1a1a' : 'none',
          background: t.accent,
          color: isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f'),
          fontFamily: t.font.title, fontSize: 22,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : (isCyber ? `0 0 24px ${t.accent}66` : '0 4px 16px rgba(0,0,0,0.15)'),
          cursor: 'pointer',
        }}>
          确定 · 我这就上号
        </button>
      </div>
    </div>
  );
}
