// Mock group data for 上号吗

const STATUS_LABELS = {
  free: { zh: '上号!', full: '空闲', en: 'FREE' },
  busy: { zh: '忙着', full: '忙碌', en: 'BUSY' },
  sleep: { zh: '睡了', full: '睡觉', en: 'SLEEP' },
  offline: { zh: '离线', full: '离线', en: 'OFFLINE' },
  custom: { zh: '自定义', full: '自定义', en: 'CUSTOM' },
};

// Emoji-style avatars as tinted circles with initials — no real emojis,
// we draw colored monograms as placeholders.
const INITIAL_GROUP = {
  name: '峡谷小分队',
  code: 'XGXFD-2077',
  members: [
    { id: 'me',  name: '我',     hue: 16,  init: '我', status: 'free',  until: 60, note: '来把排位' },
    { id: 'u2',  name: '阿K',    hue: 280, init: 'K',  status: 'free',  until: 45, note: '速来' },
    { id: 'u3',  name: '小饼干', hue: 45,  init: '饼', status: 'free',  until: 90, note: '有空' },
    { id: 'u4',  name: '老张',   hue: 200, init: '张', status: 'busy',  until: null, note: '加班ing' },
    { id: 'u5',  name: '鱼丸',   hue: 320, init: '鱼', status: 'sleep', until: null, note: '别吵' },
    { id: 'u6',  name: 'Momo',   hue: 140, init: 'M',  status: 'busy',  until: null, note: '' },
    { id: 'u7',  name: '大橘',   hue: 30,  init: '橘', status: 'free',  until: 30,  note: '只能打一把' },
    { id: 'u8',  name: 'Echo',   hue: 260, init: 'E',  status: 'offline', until: null, note: '' },
    { id: 'u9',  name: '花卷',   hue: 10,  init: '卷', status: 'custom', until: 120, note: '吃饭中 🍜' },
  ],
};

// How avatars render (no real images): solid circle with hue + initial
function Avatar({ member, size = 44, theme, ring = false, ringColor }) {
  const bg = `oklch(0.72 0.18 ${member.hue})`;
  const bg2 = `oklch(0.55 0.22 ${member.hue})`;
  const textColor = '#fff';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${bg} 0%, ${bg2} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: theme?.font?.title || "'ZCOOL KuaiLe', sans-serif",
      fontSize: size * 0.44, color: textColor,
      boxShadow: ring ? `0 0 0 3px ${theme.bg}, 0 0 0 ${3 + 2.5}px ${ringColor || theme.accent}` : 'none',
      flexShrink: 0,
      position: 'relative',
    }}>
      {member.init}
    </div>
  );
}

Object.assign(window, { STATUS_LABELS, INITIAL_GROUP, Avatar });
