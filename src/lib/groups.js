import { supabase } from './supabase.js';

const CODE_PREFIX_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

function randomPrefix() {
  let s = '';
  for (let i = 0; i < 5; i++) {
    s += CODE_PREFIX_CHARS[Math.floor(Math.random() * CODE_PREFIX_CHARS.length)];
  }
  return s;
}

function randomSuffix() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

export function generateCode() {
  return `${randomPrefix()}-${randomSuffix()}`;
}

export function normalizeCode(raw) {
  if (!raw) return '';
  const cleaned = raw.toUpperCase().replace(/\s+/g, '');
  if (cleaned.includes('-')) return cleaned;
  if (cleaned.length === 9) return cleaned.slice(0, 5) + '-' + cleaned.slice(5);
  return cleaned;
}

export async function listMyGroups() {
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, groups:group_id(id, name, code, owner_id, created_at)')
    .eq('user_id', user.id);
  if (error) throw error;
  return (data || []).map(r => r.groups).filter(Boolean);
}

export async function getGroupByCode(code) {
  if (!supabase) return null;
  const normalized = normalizeCode(code);
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, code, owner_id, created_at')
    .eq('code', normalized)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { count, error: countError } = await supabase
    .from('group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', data.id);
  if (countError) throw countError;
  return { ...data, memberCount: count ?? 0 };
}

export async function joinGroup(groupId) {
  if (!supabase) throw new Error('Supabase 未配置');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');
  const { error } = await supabase
    .from('group_members')
    .upsert({ group_id: groupId, user_id: user.id }, { onConflict: 'group_id,user_id', ignoreDuplicates: true });
  if (error) throw error;
  return true;
}

export async function createGroup(name) {
  if (!supabase) throw new Error('Supabase 未配置');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');

  let lastError = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from('groups')
      .insert({ name, code, owner_id: user.id })
      .select('id, name, code, owner_id, created_at')
      .single();
    if (!error && data) {
      await supabase
        .from('group_members')
        .upsert({ group_id: data.id, user_id: user.id }, { onConflict: 'group_id,user_id', ignoreDuplicates: true });
      return data;
    }
    lastError = error;
    if (error?.code !== '23505') break;
  }
  throw lastError || new Error('创建群组失败');
}

export async function leaveGroup(groupId) {
  if (!supabase) throw new Error('Supabase 未配置');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id);
  if (error) throw error;
}

export async function listGroupMembers(groupId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('group_members')
    .select('user_id, joined_at, profiles:user_id(id, name, hue, init)')
    .eq('group_id', groupId);
  if (error) throw error;
  return (data || [])
    .map(r => r.profiles ? { ...r.profiles, joinedAt: r.joined_at } : null)
    .filter(Boolean);
}
