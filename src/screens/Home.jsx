import React from 'react';
import { useTheme, StatusIcon } from '../lib/theme.jsx';
import { Phone } from '../components/Phone.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { STATUS_LABELS } from '../lib/constants.js';

function MyStatusBanner({ theme, me, onTap, notifyActive }) {
  const t = theme;
  const isCyber = t.key === 'cyber';
  const isCream = t.key === 'cream';
  const isCandy = t.key === 'candy';
  const sColor = t[me.status] || t.accent;
  const label = STATUS_LABELS[me.status];

  return (
    <div onClick={onTap} style={{
      margin: '0 16px', padding: '18px 20px',
      borderRadius: isCream ? 22 : 26,
      background: isCyber ? `linear-gradient(135deg, ${sColor}22 0%, ${sColor}08 100%)` : (isCream ? '#fff' : `linear-gradient(135deg, ${sColor} 0%, ${sColor}dd 100%)`),
      border: isCream ? '1.5px solid #1a1a1a' : `1.5px solid ${isCyber ? sColor + '66' : 'transparent'}`,
      boxShadow: isCream ? '5px 5px 0 #1a1a1a' : (isCyber ? `0 0 32px ${sColor}33` : '0 10px 26px rgba(0,0,0,0.1)'),
      position: 'relative', overflow: 'hidden',
      cursor: 'pointer',
    }}>
      {isCandy && (
        <div style={{
          position: 'absolute', right: -20, top: -20,
          fontFamily: t.font.title, fontSize: 80, color: 'rgba(255,255,255,0.3)',
          lineHeight: 1,
        }}>!?</div>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <div style={{
          fontFamily: t.font.mono, fontSize: 10, letterSpacing: '0.15em',
          color: isCandy ? 'rgba(255,255,255,0.85)' : t.textMuted,
        }}>
          MY STATUS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, fontFamily: t.font.mono, color: isCandy ? 'rgba(255,255,255,0.9)' : t.textMuted }}>
            TAP TO CHANGE
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke={isCandy ? 'rgba(255,255,255,0.9)' : t.textMuted} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: t.font.title, fontSize: 44, lineHeight: 1, color: isCandy ? '#fff' : t.text,
            marginBottom: 6,
          }}>{label.zh}</div>
          {me.until ? (
            <div style={{ fontSize: 13, color: isCandy ? 'rgba(255,255,255,0.85)' : t.textMuted, fontFamily: t.font.body }}>
              ⏱ 还剩 <b style={{ color: isCandy ? '#fff' : t.text }}>{me.until} 分钟</b>
              {me.note && <span> · 留言：{me.note}</span>}
            </div>
          ) : null}
        </div>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: isCandy ? 'rgba(255,255,255,0.25)' : (isCream ? sColor : 'rgba(255,255,255,0.18)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: isCream ? '1.5px solid #1a1a1a' : 'none',
          color: isCandy ? '#fff' : (isCream ? '#fff' : t.text),
          boxShadow: isCyber ? `inset 0 0 16px ${sColor}66, 0 0 20px ${sColor}44` : 'none',
          flexShrink: 0,
        }}>
          <StatusIcon status={me.status} size={34}
            color={isCandy ? '#fff' : (isCream ? '#fff' : sColor)} />
        </div>
      </div>

      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12,
        borderTop: `1px dashed ${isCandy ? 'rgba(255,255,255,0.35)' : t.border}`,
        fontSize: 12, fontFamily: t.font.mono,
        color: isCandy ? 'rgba(255,255,255,0.85)' : t.textMuted,
      }}>
        <span>LAST UPDATE · 现在</span>
        {notifyActive ? (
          <span style={{ color: isCandy ? '#fff' : t.free, fontWeight: 600 }}>● LIVE</span>
        ) : null}
      </div>
    </div>
  );
}

function MemberCard({ m, theme, featured }) {
  const t = theme;
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';
  const sColor = t[m.status] || t.textDim;
  const label = STATUS_LABELS[m.status];

  return (
    <div style={{
      padding: 14,
      borderRadius: isCream ? 18 : 22,
      background: featured
        ? (isCyber ? `linear-gradient(145deg, ${sColor}22 0%, transparent 80%)` : '#fff')
        : t.surface,
      border: featured
        ? `1.5px solid ${sColor}${isCyber ? '66' : ''}`
        : `1px solid ${t.border}`,
      boxShadow: isCream
        ? (featured ? `3px 3px 0 ${sColor}` : '2px 2px 0 rgba(0,0,0,0.1)')
        : (featured && isCyber ? `0 0 18px ${sColor}22` : 'none'),
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
      opacity: m.status === 'offline' ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Avatar member={m} size={40} theme={t} />
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 16, height: 16, borderRadius: '50%',
            background: sColor,
            border: `2px solid ${isCream ? '#fff' : t.surfaceSolid}`,
            boxShadow: isCyber && m.status === 'free' ? `0 0 8px ${sColor}` : 'none',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: t.font.body, fontWeight: 600, fontSize: 15, color: t.text,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{m.name}</div>
          <div style={{
            fontSize: 10, fontFamily: t.font.mono, color: t.textMuted,
            letterSpacing: '0.08em',
          }}>{label.en}{m.until ? ` · ${m.until}m` : ''}</div>
        </div>
      </div>

      <div style={{
        padding: '8px 10px',
        borderRadius: isCream ? 10 : 12,
        background: isCyber ? `${sColor}18` : (isCream ? `${sColor}22` : `${sColor}1a`),
        border: isCream ? `1px solid ${sColor}` : 'none',
      }}>
        <div style={{
          fontFamily: t.font.title, fontSize: 20, color: sColor,
          lineHeight: 1.1, marginBottom: m.note ? 2 : 0,
          textShadow: isCyber && m.status === 'free' ? `0 0 8px ${sColor}88` : 'none',
        }}>{label.zh}</div>
        {m.note && (
          <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.35, fontFamily: t.font.body }}>
            “{m.note}”
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ theme, label, en, count, color }) {
  const t = theme;
  return (
    <div style={{
      margin: '0 16px 10px',
      display: 'flex', alignItems: 'baseline', gap: 10,
    }}>
      <div style={{
        width: 6, height: 20, borderRadius: 2, background: color,
        transform: 'translateY(4px)',
      }} />
      <div style={{ fontFamily: t.font.title, fontSize: 22, color: t.text }}>{label}</div>
      <div style={{ fontFamily: t.font.mono, fontSize: 10, color: t.textMuted, letterSpacing: '0.12em' }}>
        {en}{count !== undefined ? ` · ${count}` : ''}
      </div>
    </div>
  );
}

function BottomTabBar({ theme }) {
  const t = theme;
  const isCream = t.key === 'cream';
  const items = [
    { icon: 'home', label: '群友', active: true },
    { icon: 'bell', label: '动态' },
    { icon: 'me',   label: '我' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12,
      bottom: 'calc(14px + env(safe-area-inset-bottom))', zIndex: 30,
      display: 'flex', gap: 6,
      padding: 6,
      borderRadius: isCream ? 22 : 999,
      background: t.dark ? 'rgba(30,30,40,0.75)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: `1px solid ${t.border}`,
      boxShadow: isCream ? '3px 3px 0 #1a1a1a' : '0 6px 20px rgba(0,0,0,0.12)',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          flex: 1, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          borderRadius: isCream ? 16 : 999,
          background: item.active ? (t.dark ? 'rgba(255,255,255,0.1)' : t.accent) : 'transparent',
          color: item.active ? (t.dark ? t.accent : (t.key === 'cream' ? '#fff' : '#1a0a1f')) : t.textMuted,
          fontFamily: t.font.body, fontSize: 13, fontWeight: 600,
        }}>
          <TabIcon kind={item.icon} size={18} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

function TabIcon({ kind, size }) {
  if (kind === 'home') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="10" r="3.5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 19c0-2.2 2-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  if (kind === 'bell') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function HomeScreen({ group, me, onStatusTap, onTriggerNotify, notifyActive, onSwitchGroup, onSignOut }) {
  const t = useTheme();
  const isCyber = t.key === 'cyber';
  const isCream = t.key === 'cream';

  const others = group.members.filter(m => m.id !== me.id);
  const sorted = [...others].sort((a, b) => {
    const order = { free: 0, custom: 1, busy: 2, sleep: 3, offline: 4 };
    return (order[a.status] ?? 5) - (order[b.status] ?? 5);
  });

  const freeCount = group.members.filter(m => m.status === 'free').length;

  return (
    <Phone theme={t}>
      <div style={{
        padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div onClick={onSwitchGroup} style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px 8px 8px',
          borderRadius: 999,
          background: t.surface,
          border: `1px solid ${t.border}`,
          boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
          cursor: onSwitchGroup ? 'pointer' : 'default',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent2} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.font.title, fontSize: 18, color: '#fff',
          }}>队</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.font.body, fontWeight: 600, fontSize: 14, color: t.text, lineHeight: 1.1 }}>
              {group.name}
            </div>
            <div style={{ fontSize: 10, fontFamily: t.font.mono, color: t.textMuted }}>
              {group.members.length} 人 · {freeCount} 空闲
            </div>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke={t.textMuted} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <button onClick={onTriggerNotify} style={{
          width: 44, height: 44, borderRadius: 999,
          background: t.surface, border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z" stroke={t.text} strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="18" cy="6" r="3" fill={t.accent}/>
          </svg>
        </button>
        {onSignOut && (
          <button onClick={onSignOut} title="退出登录" style={{
            width: 44, height: 44, borderRadius: 999,
            background: t.surface, border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
            cursor: 'pointer', padding: 0, flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 5H6a1 1 0 00-1 1v12a1 1 0 001 1h9" stroke={t.text} strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 12h8m0 0l-3-3m3 3l-3 3" stroke={t.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '4px 0 calc(100px + env(safe-area-inset-bottom))',
      }}>
        <MyStatusBanner theme={t} me={me} onTap={onStatusTap} notifyActive={notifyActive} />

        <div style={{
          margin: '22px 16px 14px',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <div style={{
            fontFamily: t.font.title, fontSize: 28, color: t.text, lineHeight: 1.05,
            whiteSpace: 'nowrap',
          }}>
            现在 <span style={{ color: t.free, textShadow: isCyber ? `0 0 12px ${t.free}88` : 'none' }}>{freeCount}</span> 人空闲
          </div>
          {freeCount >= 3 && (
            <div style={{
              fontFamily: t.font.mono, fontSize: 10, padding: '3px 8px',
              borderRadius: 6, background: t.free, color: isCream ? '#fff' : '#000',
              letterSpacing: '0.1em', fontWeight: 700,
              animation: 'pulse 1.4s ease-in-out infinite',
            }}>READY</div>
          )}
        </div>
        <div style={{
          margin: '0 16px 18px',
          fontSize: 13, color: t.textMuted, lineHeight: 1.5,
        }}>
          {freeCount >= 3 ? '凑齐了。点右上角小铃铛喊所有人上号 ↑' : '还差 ' + Math.max(0, 3 - freeCount) + ' 人就能开黑 · 再等等'}
        </div>

        <SectionLabel theme={t} label="现在空闲" en="FREE NOW" count={freeCount} color={t.free} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '0 16px',
        }}>
          {sorted.filter(m => m.status === 'free').map(m => (
            <MemberCard key={m.id} m={m} theme={t} featured />
          ))}
          {sorted.filter(m => m.status === 'custom').map(m => (
            <MemberCard key={m.id} m={m} theme={t} featured />
          ))}
        </div>

        <div style={{ height: 22 }} />
        <SectionLabel theme={t} label="暂时不在" en="LATER" color={t.textMuted} />
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '0 16px',
        }}>
          {sorted.filter(m => ['busy','sleep','offline'].includes(m.status)).map(m => (
            <MemberCard key={m.id} m={m} theme={t} />
          ))}
        </div>
      </div>

      <BottomTabBar theme={t} />

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }`}</style>
    </Phone>
  );
}
