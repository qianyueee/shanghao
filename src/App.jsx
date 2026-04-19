import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { WelcomeScreen } from './screens/Welcome.jsx';
import { JoinScreen } from './screens/Join.jsx';
import { HomeScreen } from './screens/Home.jsx';
import { StatusSheet } from './screens/StatusSheet.jsx';
import { NotifyBanner } from './screens/NotifyBanner.jsx';
import { MeSheet } from './screens/MeSheet.jsx';
import { RequireAuth } from './components/RequireAuth.jsx';
import { useAuth } from './lib/auth.jsx';
import { listMyGroups } from './lib/groups.js';
import { useGroupData } from './lib/useGroupData.js';
import { setMyStatus } from './lib/statuses.js';
import { useTheme } from './lib/theme.jsx';

function WelcomeRoute() {
  const { user, configured } = useAuth();
  if (configured && user) return <Navigate to="/home" replace />;
  return <WelcomeScreen />;
}

function JoinRoute() {
  const navigate = useNavigate();
  return <JoinScreen onEnter={(groupId) => navigate(`/home?group=${groupId}`)} />;
}

function Loading() {
  const t = useTheme();
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: t.bgGrad || t.bg, color: t.textMuted,
      fontFamily: t.font.mono, fontSize: 12, letterSpacing: '0.15em',
    }}>LOADING…</div>
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { user, profile, signOut } = useAuth();

  const [myGroups, setMyGroups] = useState(null);

  useEffect(() => {
    let active = true;
    listMyGroups().then(gs => { if (active) setMyGroups(gs); });
    return () => { active = false; };
  }, [user?.id]);

  const sheetOpen = params.get('sheet') === '1';
  const meOpen = params.get('me') === '1';
  const groupParam = params.get('group');
  const groupId = groupParam || myGroups?.[0]?.id || null;

  const { group, members, loading, applyStatusRow } = useGroupData(groupId);
  const [notifyOn, setNotifyOn] = useState(false);

  useEffect(() => {
    // Once we know the user's groups, redirect if they have none.
    if (myGroups && myGroups.length === 0) {
      navigate('/join', { replace: true });
    }
  }, [myGroups, navigate]);

  useEffect(() => {
    if (!groupParam && myGroups?.[0]?.id) {
      navigate(`/home?group=${myGroups[0].id}${sheetOpen ? '&sheet=1' : ''}`, { replace: true });
    }
  }, [groupParam, myGroups, sheetOpen, navigate]);

  const me = useMemo(() => {
    if (!user || !profile) return null;
    const meFromGroup = members.find(m => m.id === user.id);
    return {
      id: user.id,
      name: profile.name,
      hue: profile.hue,
      init: profile.init,
      status: meFromGroup?.status || 'offline',
      until: meFromGroup?.until || null,
      note: meFromGroup?.note || '',
    };
  }, [user, profile, members]);

  const freeCount = members.filter(m => m.status === 'free').length;

  useEffect(() => {
    if (freeCount >= 3) setNotifyOn(true);
  }, [freeCount]);

  if (!myGroups || !me) return <Loading />;
  if (myGroups.length === 0) return null;
  if (loading && !group) return <Loading />;
  if (!group) return <Loading />;

  const handleSave = async (edit) => {
    try {
      const row = await setMyStatus({
        status: edit.status,
        untilMinutes: edit.until,
        note: edit.note,
      });
      applyStatusRow(row);
    } catch (e) {
      console.warn('setMyStatus failed', e);
    }
    navigate(location.pathname + location.search.replace(/[?&]sheet=1/, ''), { replace: true });
  };

  const joinCall = async () => {
    try {
      const row = await setMyStatus({ status: 'free', untilMinutes: 60, note: '来了' });
      applyStatusRow(row);
    } catch (e) {
      console.warn('join call failed', e);
    }
    setNotifyOn(false);
  };

  return (
    <>
      <HomeScreen
        group={{ ...group, members }}
        me={me}
        onStatusTap={() => {
          const sp = new URLSearchParams(location.search);
          sp.set('sheet', '1');
          navigate(`${location.pathname}?${sp.toString()}`);
        }}
        onTriggerNotify={() => setNotifyOn(true)}
        notifyActive={notifyOn}
        onSwitchGroup={() => navigate('/join')}
        onMeTap={() => {
          const sp = new URLSearchParams(location.search);
          sp.set('me', '1');
          navigate(`${location.pathname}?${sp.toString()}`);
        }}
      />
      {meOpen && (
        <MeSheet
          profile={profile}
          email={user?.email}
          onClose={() => {
            const sp = new URLSearchParams(location.search);
            sp.delete('me');
            const qs = sp.toString();
            navigate(`${location.pathname}${qs ? '?' + qs : ''}`);
          }}
          onSignOut={signOut}
        />
      )}
      {sheetOpen && (
        <StatusSheet
          me={me}
          onClose={() => {
            const sp = new URLSearchParams(location.search);
            sp.delete('sheet');
            const qs = sp.toString();
            navigate(`${location.pathname}${qs ? '?' + qs : ''}`);
          }}
          onSave={handleSave}
        />
      )}
      {notifyOn && (
        <NotifyBanner
          members={members}
          onDismiss={() => setNotifyOn(false)}
          onJoin={joinCall}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomeRoute />} />
        <Route path="/welcome" element={<WelcomeRoute />} />
        <Route path="/join" element={<RequireAuth><JoinRoute /></RequireAuth>} />
        <Route path="/home" element={<RequireAuth><HomeRoute /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
