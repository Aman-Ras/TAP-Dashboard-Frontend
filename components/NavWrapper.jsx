'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function NavWrapper({ children }) {
  const [open, setOpen] = useState(false);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Mobile top bar */}
      <div className="mobile-header">
        <button className="burger-btn" onClick={() => setOpen(true)} aria-label="Open menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:'var(--surface-3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>RecruiterDash</span>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <div className="main-content">
        <div className="page-content">
          {children}
        </div>
      </div>
    </>
  );
}
