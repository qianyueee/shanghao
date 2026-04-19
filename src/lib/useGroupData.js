import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './supabase.js';
import { listGroupMembers } from './groups.js';
import { listStatusesForUsers, effectiveStatus } from './statuses.js';

export function useGroupData(groupId) {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [statusRows, setStatusRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!!groupId);
  const [now, setNow] = useState(() => Date.now());

  const memberIdsRef = useRef([]);

  useEffect(() => {
    if (!groupId || !supabase) {
      setGroup(null);
      setMembers([]);
      setStatusRows([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const { data: g, error: gErr } = await supabase
          .from('groups')
          .select('id, name, code, owner_id')
          .eq('id', groupId)
          .maybeSingle();
        if (gErr) throw gErr;
        if (!active) return;
        setGroup(g);

        const ms = await listGroupMembers(groupId);
        if (!active) return;
        setMembers(ms);
        memberIdsRef.current = ms.map(m => m.id);

        if (ms.length) {
          const rows = await listStatusesForUsers(ms.map(m => m.id));
          if (!active) return;
          setStatusRows(rows);
        } else {
          setStatusRows([]);
        }
      } catch (e) {
        if (active) setError(e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [groupId]);

  // Realtime: subscribe to status changes and membership changes.
  useEffect(() => {
    if (!groupId || !supabase) return;
    const channel = supabase.channel(`group:${groupId}`);

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'statuses' },
      (payload) => {
        const row = payload.new || payload.old;
        if (!row) return;
        if (!memberIdsRef.current.includes(row.user_id)) return;
        if (payload.eventType === 'DELETE') {
          setStatusRows(rs => rs.filter(r => r.user_id !== row.user_id));
        } else {
          setStatusRows(rs => {
            const i = rs.findIndex(r => r.user_id === payload.new.user_id);
            if (i === -1) return [...rs, payload.new];
            const copy = rs.slice();
            copy[i] = payload.new;
            return copy;
          });
        }
      }
    );

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${groupId}` },
      async () => {
        try {
          const ms = await listGroupMembers(groupId);
          setMembers(ms);
          memberIdsRef.current = ms.map(m => m.id);
          const rows = await listStatusesForUsers(ms.map(m => m.id));
          setStatusRows(rows);
        } catch (e) {
          console.warn('reload on membership change failed', e);
        }
      }
    );

    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  // Tick every 30s so expired statuses switch to offline without needing a DB write.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const applyStatusRow = useCallback((row) => {
    if (!row?.user_id) return;
    setStatusRows(rs => {
      const i = rs.findIndex(r => r.user_id === row.user_id);
      if (i === -1) return [...rs, row];
      const copy = rs.slice();
      copy[i] = row;
      return copy;
    });
  }, []);

  const enrichedMembers = useMemo(() => {
    return members.map(m => {
      const row = statusRows.find(r => r.user_id === m.id);
      const eff = effectiveStatus(row, now);
      return {
        id: m.id,
        name: m.name,
        hue: m.hue,
        init: m.init,
        status: eff.status,
        until: eff.until,
        note: eff.note,
        updated_at: eff.updated_at,
      };
    });
  }, [members, statusRows, now]);

  return { group, members: enrichedMembers, loading, error, applyStatusRow };
}
