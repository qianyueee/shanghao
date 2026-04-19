import React, { useEffect, useState } from 'react';
import { useTheme } from '../lib/theme.jsx';
import { Phone } from '../components/Phone.jsx';
import { useAuth } from '../lib/auth.jsx';
import {
  listMyGroups,
  getGroupByCode,
  joinGroup,
  createGroup,
  normalizeCode,
} from '../lib/groups.js';

export function JoinScreen({ onEnter }) {
  const t = useTheme();
  const { user, profile, signOut, configured } = useAuth();
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';

  const [mode, setMode] = useState('join'); // 'join' | 'create'
  const [code, setCode] = useState('');
  const [codeTail, setCodeTail] = useState('');
  const [preview, setPreview] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);

  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);

  const [myGroups, setMyGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(configured);

  useEffect(() => {
    if (!configured || !user) {
      setGroupsLoading(false);
      setMyGroups([]);
      return;
    }
    let active = true;
    setGroupsLoading(true);
    listMyGroups()
      .then(gs => { if (active) setMyGroups(gs); })
      .catch(e => console.warn('listMyGroups failed', e))
      .finally(() => { if (active) setGroupsLoading(false); });
    return () => { active = false; };
  }, [configured, user]);

  // Live preview: when both halves of code are complete, look up group.
  useEffect(() => {
    if (!configured) return;
    const full = (code + '-' + codeTail).replace(/^-|-$/g, '');
    if (code.length < 5 || codeTail.length < 4) {
      setPreview(null);
      setSearchError(null);
      return;
    }
    let active = true;
    setSearching(true);
    setSearchError(null);
    getGroupByCode(full)
      .then(g => {
        if (!active) return;
        if (!g) setSearchError('没找到这个群 · 检查下邀请码');
        setPreview(g);
      })
      .catch(e => { if (active) setSearchError(e.message || '查询失败'); })
      .finally(() => { if (active) setSearching(false); });
    return () => { active = false; };
  }, [code, codeTail, configured]);

  const handleJoin = async () => {
    if (!preview) return;
    setJoining(true);
    try {
      await joinGroup(preview.id);
      onEnter?.(preview.id);
    } catch (e) {
      setSearchError(e.message || '加入失败');
    } finally {
      setJoining(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const g = await createGroup(newName.trim());
      setCreated(g);
    } catch (e) {
      setSearchError(e.message || '创建失败');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Phone theme={t}>
      <div style={{
        flex: 1, padding: '24px 20px 32px',
        display: 'flex', flexDirection: 'column', gap: 18,
        overflowY: 'auto',
      }}>
        <Header theme={t} profile={profile} onSignOut={signOut} />

        <Title theme={t} mode={mode} />

        {myGroups.length > 0 && (
          <MyGroupsList theme={t} groups={myGroups} loading={groupsLoading} onPick={id => onEnter?.(id)} />
        )}

        <ModeTabs theme={t} mode={mode} setMode={setMode} />

        {mode === 'join' ? (
          <JoinPane
            theme={t} code={code} setCode={setCode}
            codeTail={codeTail} setCodeTail={setCodeTail}
            preview={preview} searching={searching} error={searchError}
            joining={joining} onJoin={handleJoin}
          />
        ) : (
          <CreatePane
            theme={t} name={newName} setName={setNewName}
            creating={creating} onCreate={handleCreate}
            created={created} onEnter={() => onEnter?.(created.id)}
            error={searchError}
          />
        )}
      </div>
    </Phone>
  );
}

function Header({ theme: t, profile, onSignOut }) {
  const isCream = t.key === 'cream';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontFamily: t.font.mono, fontSize: 11, letterSpacing: '0.15em', color: t.textMuted }}>
        / GROUPS
      </div>
      <div style={{ flex: 1 }} />
      {profile && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px 6px 6px',
          borderRadius: 999,
          background: t.surface, border: `1px solid ${t.border}`,
          boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `oklch(0.6 0.2 ${profile.hue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.font.title, color: '#fff', fontSize: 14,
          }}>{profile.init}</div>
          <div style={{ fontSize: 13, fontFamily: t.font.body, fontWeight: 600, color: t.text }}>
            {profile.name}
          </div>
          <div onClick={onSignOut} style={{
            fontSize: 11, fontFamily: t.font.mono, color: t.textMuted,
            cursor: 'pointer', paddingLeft: 6, borderLeft: `1px solid ${t.border}`,
          }}>
            退出
          </div>
        </div>
      )}
    </div>
  );
}

function Title({ theme: t, mode }) {
  return (
    <div>
      <div style={{ fontFamily: t.font.title, fontSize: 44, lineHeight: 1.02, color: t.text }}>
        {mode === 'join' ? <>加入一个<span style={{ color: t.accent }}>群组</span></> : <>开一个<span style={{ color: t.accent }}>新群</span></>}
      </div>
      <div style={{ marginTop: 10, fontSize: 14, color: t.textMuted, lineHeight: 1.5 }}>
        {mode === 'join'
          ? '找群主要一串 9 位邀请码就能加入。一个人可以加入多个群组。'
          : '创建后会拿到一个邀请码,把它发给群友让他们加进来。'}
      </div>
    </div>
  );
}

function MyGroupsList({ theme: t, groups, onPick }) {
  const isCream = t.key === 'cream';
  return (
    <div style={{
      padding: '14px 14px 10px',
      borderRadius: 18,
      background: t.surface,
      border: `1px solid ${t.border}`,
      boxShadow: isCream ? '3px 3px 0 #1a1a1a' : 'none',
    }}>
      <div style={{ fontFamily: t.font.mono, fontSize: 11, letterSpacing: '0.15em', color: t.textMuted, marginBottom: 10 }}>
        你在的群 · {groups.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {groups.map(g => (
          <div key={g.id} onClick={() => onPick(g.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 10, borderRadius: 14,
            background: t.dark ? 'rgba(255,255,255,0.04)' : '#fff',
            border: `1px solid ${t.border}`,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent2} 100%)`,
              color: '#fff', fontFamily: t.font.title, fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>队</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: t.font.body, fontWeight: 600, fontSize: 15, color: t.text }}>{g.name}</div>
              <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted }}>{g.code}</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke={t.textMuted} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeTabs({ theme: t, mode, setMode }) {
  const isCream = t.key === 'cream';
  const items = [
    { k: 'join', zh: '加入群组' },
    { k: 'create', zh: '创建群组' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 4, padding: 4,
      borderRadius: 999, background: t.surface,
      border: `1px solid ${t.border}`,
      boxShadow: isCream ? '2px 2px 0 #1a1a1a' : 'none',
    }}>
      {items.map(it => (
        <button key={it.k} onClick={() => setMode(it.k)} style={{
          flex: 1, height: 40, borderRadius: 999,
          background: mode === it.k ? t.accent : 'transparent',
          border: 'none', cursor: 'pointer',
          color: mode === it.k ? (t.key === 'cyber' ? '#000' : (isCream ? '#fff' : '#1a0a1f')) : t.textMuted,
          fontFamily: t.font.body, fontWeight: 600, fontSize: 14,
        }}>{it.zh}</button>
      ))}
    </div>
  );
}

function JoinPane({ theme: t, code, setCode, codeTail, setCodeTail, preview, searching, error, joining, onJoin }) {
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';
  return (
    <>
      <div style={{
        padding: 18,
        background: t.surface,
        border: `1.5px solid ${isCream ? '#1a1a1a' : t.border}`,
        borderRadius: 20,
        boxShadow: isCream ? '4px 4px 0 #1a1a1a' : 'none',
      }}>
        <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em', marginBottom: 12 }}>
          INVITE CODE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            value={code}
            onChange={e => setCode(normalizeCode(e.target.value).slice(0, 5))}
            maxLength={5}
            placeholder="XGXFD"
            style={{
              flex: 1, fontFamily: t.font.mono, fontSize: 30, fontWeight: 700,
              letterSpacing: '0.08em', color: t.text,
              padding: '10px 12px',
              background: isCyber ? 'rgba(0,255,136,0.06)' : (isCream ? '#fff' : '#fafafa'),
              border: `1px dashed ${t.accent}`,
              borderRadius: 12,
              textAlign: 'center', outline: 'none', minWidth: 0,
            }}
          />
          <div style={{ fontSize: 22, color: t.textDim }}>—</div>
          <input
            value={codeTail}
            onChange={e => setCodeTail(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            placeholder="2077"
            style={{
              flex: '0 0 104px', fontFamily: t.font.mono, fontSize: 30, fontWeight: 700,
              letterSpacing: '0.08em', color: t.accent,
              padding: '10px 12px',
              background: isCyber ? 'rgba(184,77,255,0.08)' : (isCream ? '#fff' : '#fafafa'),
              border: `1.5px solid ${t.accent}`,
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: isCyber ? `0 0 16px ${t.accent}44` : 'none',
              outline: 'none', minWidth: 0,
            }}
          />
        </div>
      </div>

      {searching && (
        <div style={{ fontFamily: t.font.mono, fontSize: 12, color: t.textMuted, textAlign: 'center' }}>
          SEARCHING…
        </div>
      )}

      {preview && (
        <div style={{
          padding: '14px 16px',
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
            <div style={{ fontFamily: t.font.title, fontSize: 19, color: t.text }}>{preview.name}</div>
            <div style={{ fontSize: 12, color: t.textMuted, fontFamily: t.font.mono }}>
              {preview.memberCount} MEMBERS
            </div>
          </div>
          <div style={{ color: t.free, fontFamily: t.font.mono, fontSize: 11 }}>✓ FOUND</div>
        </div>
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

      <div style={{ flex: 1 }} />

      <button
        onClick={onJoin}
        disabled={!preview || joining}
        style={{
          width: '100%', height: 58, borderRadius: isCream ? 16 : 999,
          border: isCream ? '1.5px solid #1a1a1a' : 'none',
          background: preview ? t.accent : t.surface,
          color: preview ? (isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f')) : t.textMuted,
          fontFamily: t.font.title, fontSize: 22,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : (isCyber && preview ? `0 0 24px ${t.accent}66` : 'none'),
          cursor: preview ? 'pointer' : 'not-allowed',
          opacity: joining ? 0.7 : 1,
        }}>
        {joining ? '加入中…' : '加入群组'}
      </button>
    </>
  );
}

function CreatePane({ theme: t, name, setName, creating, onCreate, created, onEnter, error }) {
  const isCream = t.key === 'cream';
  const isCyber = t.key === 'cyber';

  if (created) {
    return (
      <>
        <div style={{
          padding: 20,
          background: t.surface,
          border: `1.5px solid ${isCream ? '#1a1a1a' : t.border}`,
          borderRadius: 20,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : 'none',
        }}>
          <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em', marginBottom: 10 }}>
            群已创建 · 把这串码发给群友
          </div>
          <div style={{
            fontFamily: t.font.mono, fontSize: 32, fontWeight: 700,
            color: t.accent, letterSpacing: '0.08em', textAlign: 'center',
            padding: '14px 10px',
            background: isCyber ? 'rgba(184,77,255,0.08)' : (isCream ? '#fff' : '#fafafa'),
            border: `1.5px dashed ${t.accent}`,
            borderRadius: 12,
            boxShadow: isCyber ? `0 0 16px ${t.accent}44` : 'none',
          }}>{created.code}</div>
          <button
            onClick={() => navigator.clipboard?.writeText(created.code)}
            style={{
              width: '100%', height: 40, marginTop: 12,
              borderRadius: 999,
              border: `1px solid ${t.border}`, background: 'transparent', color: t.text,
              fontFamily: t.font.body, fontSize: 13, cursor: 'pointer',
            }}>
            复制邀请码
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onEnter} style={{
          width: '100%', height: 58, borderRadius: isCream ? 16 : 999,
          border: isCream ? '1.5px solid #1a1a1a' : 'none',
          background: t.accent,
          color: isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f'),
          fontFamily: t.font.title, fontSize: 22,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : (isCyber ? `0 0 24px ${t.accent}66` : 'none'),
          cursor: 'pointer',
        }}>
          进入群组
        </button>
      </>
    );
  }

  return (
    <>
      <div style={{
        padding: 18,
        background: t.surface,
        border: `1.5px solid ${isCream ? '#1a1a1a' : t.border}`,
        borderRadius: 20,
        boxShadow: isCream ? '4px 4px 0 #1a1a1a' : 'none',
      }}>
        <div style={{ fontFamily: t.font.mono, fontSize: 11, color: t.textMuted, letterSpacing: '0.12em', marginBottom: 12 }}>
          GROUP NAME
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value.slice(0, 20))}
          placeholder="例如:峡谷小分队"
          style={{
            width: '100%', border: 'none', outline: 'none',
            background: 'transparent',
            fontFamily: t.font.title, fontSize: 28, color: t.text,
            padding: '4px 0',
          }}
        />
        <div style={{ fontSize: 11, color: t.textDim, fontFamily: t.font.mono, marginTop: 6 }}>
          {name.length}/20
        </div>
      </div>

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

      <div style={{ flex: 1 }} />

      <button
        onClick={onCreate}
        disabled={!name.trim() || creating}
        style={{
          width: '100%', height: 58, borderRadius: isCream ? 16 : 999,
          border: isCream ? '1.5px solid #1a1a1a' : 'none',
          background: name.trim() ? t.accent : t.surface,
          color: name.trim() ? (isCyber ? '#000' : (isCream ? '#fff' : '#1a0a1f')) : t.textMuted,
          fontFamily: t.font.title, fontSize: 22,
          boxShadow: isCream ? '4px 4px 0 #1a1a1a' : (isCyber && name.trim() ? `0 0 24px ${t.accent}66` : 'none'),
          cursor: name.trim() ? 'pointer' : 'not-allowed',
          opacity: creating ? 0.7 : 1,
        }}>
        {creating ? '创建中…' : '创建群组'}
      </button>
    </>
  );
}
