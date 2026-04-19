// App — glues all screens into a 5-panel flow display

const { useState, useMemo, useEffect } = React;

function FlowScreen({ title, en, num, desc, children }) {
  return (
    <div className="screen-wrap">
      {children}
      <div className="screen-caption">
        <div className="cap-num">{num} · {en}</div>
        <div className="cap-title">{title}</div>
        <div className="cap-desc">{desc}</div>
      </div>
    </div>
  );
}

function App() {
  const theme = useTheme();

  // Shared state (live demo)
  const [members, setMembers] = useState(INITIAL_GROUP.members);
  const me = useMemo(() => members.find(m => m.id === 'me'), [members]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [notifyOn, setNotifyOn] = useState(false);

  // Update my status
  const saveStatus = (edit) => {
    setMembers(ms => ms.map(m => m.id === 'me' ? { ...m, ...edit } : m));
    setSheetOpen(false);
  };
  const freeCount = members.filter(m => m.status === 'free').length;

  // Auto-show notify when >= 3 free (and show screen 5 as well regardless)
  useEffect(() => {
    if (freeCount >= 3) setNotifyOn(true);
  }, [freeCount]);

  return (
    <>
      <FlowScreen num="01" en="WELCOME" title="欢迎 / 登录"
        desc="超大品牌字 + 4 种状态胶囊展示，建立视觉基调">
        <WelcomeScreen theme={theme} />
      </FlowScreen>

      <FlowScreen num="02" en="JOIN GROUP" title="用邀请码加入群组"
        desc="群主生成 9 位码分享。找到群会立刻显示预览卡。">
        <JoinScreen theme={theme} />
      </FlowScreen>

      <FlowScreen num="03" en="HOME · LIVE" title="主界面 · 群组状态一览"
        desc="可交互：点顶部「我的状态」切换自己。点右上铃铛触发通知。">
        <div style={{ position: 'relative' }}>
          <HomeScreen
            theme={theme} group={{ ...INITIAL_GROUP, members }} me={me}
            onStatusTap={() => setSheetOpen(true)}
            onTriggerNotify={() => setNotifyOn(true)}
            notifyActive={notifyOn}
          />
          {sheetOpen && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 48, overflow: 'hidden' }}>
              <StatusSheet theme={theme} me={me} onClose={() => setSheetOpen(false)} onSave={saveStatus} />
            </div>
          )}
          {notifyOn && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: 48, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{ position: 'relative', height: '100%', pointerEvents: 'auto' }}>
                <NotifyBanner theme={theme} members={members}
                  onDismiss={() => setNotifyOn(false)}
                  onJoin={() => setNotifyOn(false)} />
              </div>
            </div>
          )}
        </div>
      </FlowScreen>

      <FlowScreen num="04" en="STATUS SHEET" title="切换我的状态"
        desc="4 种状态 · 可设时长（空闲 1 小时）· 可留言。底部弹起卡片。">
        <div style={{ position: 'relative' }}>
          <HomeScreen
            theme={theme} group={{ ...INITIAL_GROUP, members }} me={me}
            onStatusTap={() => {}}
            onTriggerNotify={() => {}}
            notifyActive={false}
          />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 48, overflow: 'hidden', pointerEvents: 'none' }}>
            <StaticStatusSheet theme={theme} me={me} />
          </div>
        </div>
      </FlowScreen>

      <FlowScreen num="05" en="NOTIFY" title="凑齐 3 人 · 横幅通知"
        desc="类似系统推送 · 从顶部下滑 · 一键「我来了」响应召集。">
        <div style={{ position: 'relative' }}>
          <HomeScreen
            theme={theme} group={{ ...INITIAL_GROUP, members }} me={me}
            onStatusTap={() => {}} onTriggerNotify={() => {}}
            notifyActive={true}
          />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 48, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <NotifyBanner theme={theme} members={members} onDismiss={() => {}} onJoin={() => {}} />
            </div>
          </div>
        </div>
      </FlowScreen>
    </>
  );
}

// Static version of StatusSheet for the flow demo (no dismiss overlay that blocks)
function StaticStatusSheet({ theme, me }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-end',
      pointerEvents: 'auto',
    }}>
      <div style={{ width: '100%' }}>
        <StatusSheet theme={theme} me={me} onClose={() => {}} onSave={() => {}} />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('flow-screens'));
root.render(<App />);
