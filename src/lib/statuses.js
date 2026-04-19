import { supabase } from './supabase.js';

export async function setMyStatus({ status, untilMinutes, note }) {
  if (!supabase) throw new Error('Supabase 未配置');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');
  const row = {
    user_id: user.id,
    status,
    until_minutes: status === 'free' || status === 'custom' ? untilMinutes ?? null : null,
    note: note ?? '',
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('statuses')
    .upsert(row, { onConflict: 'user_id' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function listStatusesForUsers(userIds) {
  if (!supabase || !userIds?.length) return [];
  const { data, error } = await supabase
    .from('statuses')
    .select('user_id, status, until_minutes, note, updated_at')
    .in('user_id', userIds);
  if (error) throw error;
  return data || [];
}

export function remainingMinutes(statusRow, now = Date.now()) {
  if (!statusRow?.until_minutes) return null;
  const updated = new Date(statusRow.updated_at).getTime();
  const elapsedMin = (now - updated) / 60000;
  const remaining = statusRow.until_minutes - elapsedMin;
  return Math.max(0, Math.round(remaining));
}

export function effectiveStatus(statusRow, now = Date.now()) {
  if (!statusRow) return { status: 'offline', until: null, note: '', updated_at: null };
  const remaining = remainingMinutes(statusRow, now);
  const expired = (statusRow.status === 'free' || statusRow.status === 'custom')
    && statusRow.until_minutes != null && remaining === 0;
  return {
    status: expired ? 'offline' : statusRow.status,
    until: expired ? null : remaining,
    note: statusRow.note || '',
    updated_at: statusRow.updated_at,
  };
}
