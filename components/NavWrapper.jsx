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
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:18, fontWeight:800, color:'#ffffff', letterSpacing:'-0.5px', lineHeight:1 }}>berlin</span>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', display:'inline-block', flexShrink:0 }} />
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
