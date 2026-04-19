import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { useTheme } from '../lib/theme.jsx';

export function RequireAuth({ children }) {
  const { user, loading, configured } = useAuth();
  const location = useLocation();
  const t = useTheme();

  if (!configured) return children;

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.bg, color: t.textMuted,
        fontFamily: t.font.mono, fontSize: 12, letterSpacing: '0.15em',
      }}>LOADING…</div>
    );
  }

  if (!user) return <Navigate to="/welcome" replace state={{ from: location }} />;

  return children;
}
