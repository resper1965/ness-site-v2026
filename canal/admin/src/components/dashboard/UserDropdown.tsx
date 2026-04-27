import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export function UserDropdown({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sidebar-footer" ref={ref} style={{ position: 'relative' }}>
      <button 
        className="user-info" 
        onClick={() => setOpen(!open)}
        style={{ 
          background: 'transparent', border: 'none', textAlign: 'left', width: '100%',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 0, cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <div className="user-avatar" style={{ minWidth: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="user-details" style={{ overflow: 'hidden' }}>
            <div className="user-name">{user.name || "Admin"}</div>
            <div className="user-email truncate">{user.email}</div>
          </div>
        </div>
        <svg className="user-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 16, right: 16, marginBottom: 8,
          background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8,
          padding: 6, boxShadow: '0 -4px 12px rgba(0,0,0,0.1)', zIndex: 100,
          display: 'flex', flexDirection: 'column', gap: 2
        }}>
          <button 
            className="nav-link" 
            onClick={() => { setOpen(false); navigate('/account'); }}
            style={{ margin: 0, padding: '8px 12px', width: '100%', justifyContent: 'flex-start' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Minha Conta
          </button>
          
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
          
          <button 
            className="nav-link" 
            onClick={() => { setOpen(false); onSignOut(); }}
            style={{ margin: 0, padding: '8px 12px', width: '100%', color: 'var(--danger)', justifyContent: 'flex-start' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair da Plataforma
          </button>
        </div>
      )}
    </div>
  );
}
