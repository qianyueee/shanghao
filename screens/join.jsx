// Join by invite code screen

function JoinScreen({ theme }) {
  const t = theme;
  const [code, setCode] = React.useState('XGXFD');
  const [code2, setCode2] = React.useState('2077');
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';

  return (
    <Phone theme={t}>
      <div style={{
        flex: 1, padding: '24px 24px 32px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <div style={{
            width: 40, height: 40, borderRadius: isCream ? 10 : 999,
            background: t.surface,
            border: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
          }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M10 2L2 10l8 8" stroke={t.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: t.font.mono, fontSize: 11, letterSpacing: '0.15em', color: t.textMuted }}>
            STEP 02 / 03
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: t.font.title, fontSize: 48, lineHeight: 1.02, color: t.text,
          }}>
            输入<span style={{ color: t.accent }}>邀请码</span><br/>加入群组
          </div>
          <div style={{ marginTop: 14, fontSize: 15, color: t.textMuted, lineHeight: 1.5 }}>
            找群主要一串 9 位的邀请码就能加入。<br/>一个人可以加入多个群组。
          </div>
        </div>

        {/* Big code input */}
        <div style={{
          padding: 20,
          background: isCream ? t.surface : t.surface,
          border: `1.5px solid ${isCream ? '#1a1a1a' : t.border}`,
          borderRadius: 22,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : 'none',
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em', marginBottom: 14 }}>
            INVITE CODE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              flex: 1, fontFamily: t.font.mono, fontSize: 36, fontWeight: 700,
              letterSpacing: '0.08em', color: t.text,
              padding: '10px 14px',
              background: isCyber ? 'rgba(0,255,136,0.06)' : (isCream ? '#fff' : '#fafafa'),
              border: `1px dashed ${t.accent}`,
              borderRadius: 14,
              textAlign: 'center',
            }}>{code}</div>
            <div style={{ fontSize: 28, color: t.textDim }}>—</div>
            <div style={{
              flex: '0 0 108px', fontFamily: t.font.mono, fontSize: 36, fontWeight: 700,
              letterSpacing: '0.08em', color: t.accent,
              padding: '10px 14px',
              background: isCyber ? 'rgba(184,77,255,0.08)' : (isCream ? '#fff' : '#fafafa'),
              border: `1.5px solid ${t.accent}`,
              borderRadius: 14,
              textAlign: 'center',
              boxShadow: isCyber ? `0 0 16px ${t.accent}44` : 'none',
            }}>{code2}<span style={{
              display: 'inline-block', width: 2, height: 28,
              background: t.accent, marginLeft: 3, verticalAlign: 'middle',
              animation: 'blink 1s infinite',
            }}/></div>
          </div>
        </div>

        {/* Preview of group that will be joined */}
        <div style={{
          padding: '16px 18px',
          background: isCyber ? 'rgba(0,255,136,0.06)' : (isCream ? 'rgba(46,133,64,0.1)' : 'rgba(0,200,83,0.08)'),
          border: `1.5px solid ${t.free}55`,
          borderRadius: 18,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent2} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.font.title, fontSize: 22, color: '#fff',
          }}>队</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.font.title, fontSize: 19, color: t.text }}>峡谷小分队</div>
            <div style={{ fontSize: 12, color: t.textMuted, fontFamily: t.font.mono }}>
              9 MEMBERS · 群主: 阿K
            </div>
          </div>
          <div style={{ color: t.free, fontFamily: t.font.mono, fontSize: 11 }}>✓ FOUND</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Keypad hint */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          marginBottom: 16,
        }}>
          {['1','2','3','4','5','6','7','8','9','0'].map((k, i) => (
            <div key={k} style={{
              gridColumn: k === '0' ? '2' : undefined,
              height: 54, borderRadius: 14,
              background: isCream ? '#fff' : t.surface,
              border: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: t.font.mono, fontSize: 22, fontWeight: 600, color: t.text,
              boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
            }}>{k}</div>
          ))}
        </div>

        <button style={{
          width: '100%', height: 58, borderRadius: isCream ? 16 : 999,
          border: isCream ? '1.5px solid #1a1a1a' : 'none',
          background: t.accent,
          color: isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f'),
          fontFamily: t.font.title, fontSize: 22,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : (isCyber ? `0 0 24px ${t.accent}66` : '0 4px 16px rgba(0,0,0,0.15)'),
          cursor: 'pointer',
        }}>
          加入群组
        </button>
      </div>

      <style>{`@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
    </Phone>
  );
}

Object.assign(window, { JoinScreen });
