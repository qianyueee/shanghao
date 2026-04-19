// Shared phone shell — wraps iOS device with theme bg
// Use instead of raw IOSDevice when you want themed bg + optional status bar only

function Phone({ children, theme, showStatusBar = true, showHomeIndicator = true, noPadding = false }) {
  const width = 402, height = 874;
  return (
    <div style={{
      width, height, borderRadius: 48, overflow: 'hidden',
      position: 'relative',
      background: theme.bgGrad || theme.bg,
      boxShadow: '0 30px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: theme.font.body,
      color: theme.text,
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* subtle noise for cream theme */}
      {theme.key === 'cream' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          opacity: 0.35, mixBlendMode: 'multiply',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.4 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.25'/></svg>")`,
        }} />
      )}
      {/* cyber glow */}
      {theme.key === 'cyber' && (
        <div style={{
          position: 'absolute', top: -80, left: -40, right: -40, height: 380, zIndex: 0,
          background: 'radial-gradient(ellipse at 30% 30%, rgba(0,255,136,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(184,77,255,0.18) 0%, transparent 55%)',
          pointerEvents: 'none', filter: 'blur(20px)',
        }} />
      )}

      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }} />

      {showStatusBar && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 }}>
          <IOSStatusBar dark={theme.dark} />
        </div>
      )}

      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        paddingTop: showStatusBar ? 60 : 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {children}
      </div>

      {showHomeIndicator && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
          height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          paddingBottom: 8, pointerEvents: 'none',
        }}>
          <div style={{
            width: 139, height: 5, borderRadius: 100,
            background: theme.dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.35)',
          }} />
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Phone });
