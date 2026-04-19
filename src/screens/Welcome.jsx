import React, { useState } from 'react';
import { useTheme } from '../lib/theme.jsx';
import { Phone } from '../components/Phone.jsx';
import { useAuth } from '../lib/auth.jsx';

function inputStyle(t, isCream) {
  return {
    width: '100%', height: 44, padding: '0 14px',
    borderRadius: isCream ? 10 : 12,
    border: `1px solid ${t.border}`,
    background: isCream ? '#fff' : (t.key === 'cyber' ? 'rgba(255,255,255,0.04)' : t.surface),
    color: t.text,
    fontFamily: t.font.body, fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  };
}

function GoogleMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.8 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.8 6.1 29.1 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5c-1.8 1.3-4.2 2-7 2-5.3 0-9.7-3.4-11.3-8L6 32.7C9.2 39.1 16 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 5c4.1-3.7 6.7-9.2 6.7-15 0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

export function WelcomeScreen() {
  const t = useTheme();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, configured, loading: authLoading, user } = useAuth();
  const isCyber = t.key === 'cyber';
  const isCandy = t.key === 'candy';
  const isCream = t.key === 'cream';

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailMode, setEmailMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState(null);

  const handleLogin = async () => {
    if (!configured) {
      setError('还没配置 Supabase — 在 .env 里填 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e?.message || '登录失败');
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!configured) {
      setError('还没配置 Supabase');
      return;
    }
    if (!email || !password) {
      setError('邮箱和密码都要填');
      return;
    }
    if (emailMode === 'signup' && password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (emailMode === 'signin') {
        await signInWithEmail({ email, password });
      } else {
        const data = await signUpWithEmail({ email, password, name: name.trim() });
        if (!data.session) {
          setInfo('注册成功 · 去邮箱点确认链接后再登录');
          setEmailMode('signin');
          setPassword('');
        }
      }
    } catch (err) {
      setError(err?.message || '操作失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Phone theme={t}>
      <div style={{
        flex: 1, padding: '40px 28px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative',
        overflowY: 'auto',
        minHeight: 0,
      }}>
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
              border: `${isCream ? 1.5 : 1}px solid ${t.border}`,
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleLogin}
            disabled={busy || authLoading}
            style={{
              width: '100%', height: 60,
              borderRadius: isCream ? 16 : 999,
              border: isCream ? '1.5px solid #1a1a1a' : 'none',
              background: t.accent,
              color: isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f'),
              fontFamily: t.font.title, fontSize: 22,
              cursor: busy ? 'wait' : 'pointer',
              opacity: busy ? 0.7 : 1,
              boxShadow: isCream
                ? '4px 4px 0 #1a1a1a'
                : (isCyber ? `0 0 24px ${t.accent}66, 0 4px 20px rgba(0,0,0,0.4)` : '0 6px 0 rgba(0,0,0,0.15), 0 12px 30px rgba(255,77,141,0.3)'),
              letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GoogleMark size={18} />
            </span>
            {busy ? '跳转中…' : '用 Google 登录'}
          </button>

          <button
            type="button"
            onClick={() => { setEmailOpen(v => !v); setError(null); setInfo(null); }}
            style={{
              background: 'none', border: 'none',
              color: t.textMuted, fontSize: 13,
              fontFamily: t.font.mono,
              textAlign: 'center', cursor: 'pointer',
              padding: '4px 0',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}>
            {emailOpen ? '收起' : '或用邮箱登录 / 注册'}
          </button>

          {emailOpen && (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                display: 'flex', gap: 0, padding: 3,
                background: isCream ? t.surface : (isCyber ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'),
                border: `1px solid ${t.border}`,
                borderRadius: 10,
              }}>
                {[
                  { k: 'signin', lbl: '登录' },
                  { k: 'signup', lbl: '注册' },
                ].map(tab => {
                  const active = emailMode === tab.k;
                  return (
                    <button
                      key={tab.k}
                      type="button"
                      onClick={() => { setEmailMode(tab.k); setError(null); setInfo(null); }}
                      style={{
                        flex: 1, padding: '8px 0',
                        border: 'none',
                        background: active ? t.accent : 'transparent',
                        color: active ? (isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f')) : t.textMuted,
                        fontFamily: t.font.title, fontSize: 15,
                        borderRadius: 8, cursor: 'pointer',
                      }}>
                      {tab.lbl}
                    </button>
                  );
                })}
              </div>

              {emailMode === 'signup' && (
                <input
                  type="text"
                  placeholder="昵称(可选)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle(t, isCream)}
                />
              )}
              <input
                type="email"
                placeholder="邮箱"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle(t, isCream)}
              />
              <input
                type="password"
                placeholder={emailMode === 'signup' ? '密码(至少 6 位)' : '密码'}
                autoComplete={emailMode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle(t, isCream)}
              />
              <button
                type="submit"
                disabled={busy || authLoading}
                style={{
                  width: '100%', height: 48,
                  borderRadius: isCream ? 12 : 999,
                  border: isCream ? '1.5px solid #1a1a1a' : `1px solid ${t.border}`,
                  background: isCream ? t.surface : 'transparent',
                  color: t.text,
                  fontFamily: t.font.title, fontSize: 17,
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.7 : 1,
                  boxShadow: isCream ? '3px 3px 0 #1a1a1a' : 'none',
                }}>
                {busy ? '处理中…' : (emailMode === 'signin' ? '登录' : '注册')}
              </button>
            </form>
          )}

          {info && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: t.accent + '22',
              border: `1px solid ${t.accent}55`,
              color: t.text,
              fontSize: 12, fontFamily: t.font.mono, lineHeight: 1.5,
            }}>{info}</div>
          )}

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: t.danger + '22',
              border: `1px solid ${t.danger}55`,
              color: t.danger,
              fontSize: 12, fontFamily: t.font.mono, lineHeight: 1.5,
            }}>{error}</div>
          )}

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
