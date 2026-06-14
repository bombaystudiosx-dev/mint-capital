// Icon set — ported from bank-components.jsx. Stroke-based 24x24 SVG glyphs.

import type { CSSProperties } from 'react';
import { T } from '../theme';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 24, color = T.text, style = {} }: IconProps) {
  const s: CSSProperties = { width: size, height: size, display: 'block', flexShrink: 0, ...style };
  const p = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  switch (name) {
    case 'home':
      return <svg style={s} viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" {...p} /><path d="M9 21V12h6v9" {...p} /></svg>;
    case 'wallet':
      return <svg style={s} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="15" rx="3" {...p} /><path d="M2 9h20" {...p} /><circle cx="16" cy="14" r="1.5" fill={color} /></svg>;
    case 'send':
      return <svg style={s} viewBox="0 0 24 24"><path d="M22 2L11 13" {...p} /><path d="M22 2L15 22l-4-9-9-4 20-7z" {...p} /></svg>;
    case 'history':
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p} /><path d="M12 7v5l3 3" {...p} /></svg>;
    case 'profile':
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" {...p} /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" {...p} /></svg>;
    case 'bell':
      return <svg style={s} viewBox="0 0 24 24"><path d="M18 10a6 6 0 00-12 0v5l-2 2h16l-2-2v-5z" {...p} /><path d="M10 19a2 2 0 004 0" {...p} /></svg>;
    case 'shield':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 3L4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7L12 3z" {...p} /><path d="M9 12l2 2 4-4" {...p} /></svg>;
    case 'eye':
      return <svg style={s} viewBox="0 0 24 24"><path d="M2 12c2-5 5.5-8 10-8s8 3 10 8c-2 5-5.5 8-10 8s-8-3-10-8z" {...p} /><circle cx="12" cy="12" r="3" {...p} /></svg>;
    case 'eye-off':
      return <svg style={s} viewBox="0 0 24 24"><path d="M3 3l18 18M10.5 10.7A3 3 0 0013.3 13.5M6.3 6.3C4 8 2.5 10 2 12c2 5 5.5 8 10 8 2 0 3.8-.6 5.4-1.6M9.5 4.5A9.6 9.6 0 0112 4c4.5 0 8 3 10 8-.6 1.6-1.5 3-2.6 4.1" {...p} /></svg>;
    case 'arrow-left':
      return <svg style={s} viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" {...p} /></svg>;
    case 'chevron-right':
      return <svg style={s} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" {...p} /></svg>;
    case 'plus':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" {...p} /></svg>;
    case 'check':
      return <svg style={s} viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
    case 'x':
      return <svg style={s} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" {...p} /></svg>;
    case 'search':
      return <svg style={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...p} /><path d="M21 21l-4.35-4.35" {...p} /></svg>;
    case 'logout':
      return <svg style={s} viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H9" {...p} /><path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4" {...p} /></svg>;
    case 'gear':
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" {...p} /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" {...p} /></svg>;
    case 'user':
      return <svg style={s} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...p} /><circle cx="12" cy="7" r="4" {...p} /></svg>;
    case 'receive':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 3v13M5 12l7 7 7-7" {...p} /><path d="M5 20h14" {...p} /></svg>;
    case 'pay':
      return <svg style={s} viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" {...p} /><path d="M9 7h6M9 11h6M9 15h4" {...p} /></svg>;
    case 'card':
      return <svg style={s} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3" {...p} /><path d="M2 9h20" {...p} /><rect x="5" y="13" width="5" height="2" rx="1" fill={color} /></svg>;
    case 'income':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
    case 'transfer':
      return <svg style={s} viewBox="0 0 24 24"><path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3" {...p} /></svg>;
    case 'freeze':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" {...p} /></svg>;
    case 'lock':
      return <svg style={s} viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" {...p} /><path d="M8 11V7a4 4 0 018 0v4" {...p} /><circle cx="12" cy="16" r="1.5" fill={color} /></svg>;
    case 'fingerprint':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 4C7.58 4 4 7.58 4 12M12 4c4.42 0 8 3.58 8 8M12 4v2M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4M12 12v5" {...p} /><path d="M9 15a3 3 0 006 0" {...p} /></svg>;
    case 'info':
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p} /><path d="M12 8v1M12 12v5" {...p} /></svg>;
    case 'promo':
      return <svg style={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...p} /></svg>;
    case 'phone':
      return <svg style={s} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012.88 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z" {...p} /></svg>;
    case 'help':
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p} /><path d="M9 9a3 3 0 015.12 2.1c0 1.9-3.12 3-3.12 3v.9" {...p} /><circle cx="12" cy="17" r="0.5" fill={color} /></svg>;
    default:
      return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p} /></svg>;
  }
}
