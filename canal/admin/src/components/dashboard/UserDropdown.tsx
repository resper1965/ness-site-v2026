import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export function UserDropdown({ user, isSuperAdmin, onSignOut }: { user: any, isSuperAdmin?: boolean, onSignOut: () => void }) {
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
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header Profile Section */}
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ minWidth: 40, height: 40, borderRadius: '50%', background: '#3b4363', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.2 }}>{user.name || "Admin"}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{user.email}</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', width: '100%' }} />

          {/* Menu Items */}
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
            <button 
              className="nav-link" 
              onClick={() => { setOpen(false); navigate('/account'); }}
              style={{ padding: '10px 16px', width: '100%', justifyContent: 'flex-start', fontSize: 14, color: 'var(--text)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, opacity: 0.7 }}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Conta
            </button>
            <button 
              className="nav-link" 
              onClick={() => { setOpen(false); navigate('/saas-billing'); }}
              style={{ padding: '10px 16px', width: '100%', justifyContent: 'flex-start', fontSize: 14, color: 'var(--text)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, opacity: 0.7 }}>
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              Faturamento
            </button>
            <button 
              className="nav-link" 
              onClick={() => { setOpen(false); navigate('/account'); }}
              style={{ padding: '10px 16px', width: '100%', justifyContent: 'flex-start', fontSize: 14, color: 'var(--text)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, opacity: 0.7 }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Notificações
            </button>
          </div>
          {isSuperAdmin && (
            <>
              <div style={{ height: 1, background: 'var(--border)', width: '100%' }} />
              <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', background: 'rgba(239, 68, 68, 0.05)' }}>
                <button 
                  className="nav-link" 
                  onClick={() => { setOpen(false); navigate('/organizations'); }}
                  style={{ padding: '10px 16px', width: '100%', justifyContent: 'flex-start', fontSize: 13, fontWeight: 600, color: '#ef4444' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, opacity: 0.9 }}>
                    <path d="M18 10h-1.26a8 8 0 1 0-9.48 0H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM12 10v4M10 14h4"/>
                  </svg>
                  Painel Admin Console
                </button>
              </div>
            </>
          )}

          <div style={{ height: 1, background: 'var(--border)', width: '100%' }} />

          {/* Logout Section */}
          <div style={{ padding: '8px 0' }}>
            <button 
              className="nav-link" 
              onClick={() => { setOpen(false); onSignOut(); }}
              style={{ padding: '10px 16px', width: '100%', justifyContent: 'flex-start', fontSize: 14, color: 'var(--text)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, opacity: 0.7 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
