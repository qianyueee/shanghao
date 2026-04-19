import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, supabaseConfigured } from './supabase.js';

const AuthContext = createContext(null);

function randomHue() {
  return Math.floor(Math.random() * 360);
}

function initialFromName(name) {
  if (!name) return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return Array.from(trimmed)[0];
}

async function ensureProfile(user) {
  if (!supabase || !user) return null;
  const { data: existing, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) {
    console.warn('ensureProfile select failed', error);
    return null;
  }
  if (existing) return existing;

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    '玩家';
  const row = {
    id: user.id,
    name,
    hue: randomHue(),
    init: initialFromName(name),
  };
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id', ignoreDuplicates: true });
  if (upsertError) {
    console.warn('ensureProfile upsert failed', upsertError);
    return row;
  }
  const { data: final } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  return final || row;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        ensureProfile(data.session.user).then(p => {
          if (active) setProfile(p);
        });
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        ensureProfile(newSession.user).then(p => setProfile(p));
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase 未配置');
    const redirectTo = window.location.origin + import.meta.env.BASE_URL;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
  }, []);

  const signInWithEmail = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase 未配置');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUpWithEmail = useCallback(async ({ email, password, name }) => {
    if (!supabase) throw new Error('Supabase 未配置');
    const emailRedirectTo = window.location.origin + import.meta.env.BASE_URL;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: name ? { full_name: name } : undefined,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const p = await ensureProfile(session.user);
    setProfile(p);
    return p;
  }, [session]);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    configured: supabaseConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
