// Welcome / Login screen — first launch

function WelcomeScreen({ theme, onStart }) {
  const t = theme;
  const isCyber = t.key === 'cyber';
  const isCandy = t.key === 'candy';
  const isCream = t.key === 'cream';

  return (
    <Phone theme={t}>
      <div style={{
        flex: 1, padding: '40px 28px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Giant branding */}
        <div style={{ marginTop: 40 }}>
          <div style={{
            fontFamily: t.font.mono, fontSize: 11, letterSpacing: '0.25em',
            color: t.textMuted, marginBottom: 20,
          }}>
            · {t.tagline} ·
          </div>

          <div style={{
            fontFamily: t.font.title,
            fontSize: 120, lineHeight: 0.88,
            color: t.text, letterSpacing: '-0.03em',
            position: 'relative',
          }}>
            <div>上<span style={{ color: t.accent }}>号</span></div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              吗
              <span style={{ color: t.accent, fontSize: 140 }}>?</span>
            </div>
          </div>

          <div style={{
            marginTop: 24, fontSize: 17, lineHeight: 1.5,
            color: t.textMuted, maxWidth: 280,
            fontFamily: t.font.body,
          }}>
            把群友的状态挂在一张卡上。<br/>
            谁空闲 · 谁在忙 · 3 人齐活就喊开黑。
          </div>
        </div>

        {/* Decorative status pill chain */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          margin: '24px 0',
        }}>
          {[
            { s: 'free', lbl: '上号!' },
            { s: 'busy', lbl: '忙着' },
            { s: 'sleep', lbl: '睡了' },
            { s: 'custom', lbl: '吃饭中' },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
              background: isCream ? t.surface : (isCandy ? '#fff' : t.surface),
              border: `${isCream ? 1.5 : 1}px solid ${isCream ? t.border : t.border}`,
              boxShadow: isCream ? '3px 3px 0 #1a1a1a' : 'none',
              fontFamily: t.font.title,
              fontSize: 18,
              color: t.text,
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: t[p.s],
                boxShadow: isCyber ? `0 0 10px ${t[p.s]}` : 'none',
              }} />
              {p.lbl}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onStart} style={{
            width: '100%', height: 60,
            borderRadius: isCream ? 16 : 999,
            border: isCream ? '1.5px solid #1a1a1a' : 'none',
            background: t.accent,
            color: isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f'),
            fontFamily: t.font.title, fontSize: 24,
            cursor: 'pointer',
            boxShadow: isCream
              ? '4px 4px 0 #1a1a1a'
              : (isCyber ? `0 0 24px ${t.accent}66, 0 4px 20px rgba(0,0,0,0.4)` : '0 6px 0 rgba(0,0,0,0.15), 0 12px 30px rgba(255,77,141,0.3)'),
            letterSpacing: '0.02em',
          }}>
            开始上号 →
          </button>
          <button style={{
            width: '100%', height: 52,
            borderRadius: isCream ? 16 : 999,
            border: `1.5px solid ${t.border}`,
            background: 'transparent',
            color: t.text,
            fontFamily: t.font.body, fontSize: 15, fontWeight: 500,
            cursor: 'pointer',
          }}>
            已有账号 · 登录
          </button>
          <div style={{
            textAlign: 'center', fontSize: 12, color: t.textDim,
            fontFamily: t.font.mono, marginTop: 4,
          }}>
            v1.0 · 只看自己群组 · 不发广告
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { WelcomeScreen });
