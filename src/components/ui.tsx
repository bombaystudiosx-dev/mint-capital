// Shared UI components — ported from bank-components.jsx.

import { useState, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { T } from '../theme';
import { Auth, F } from '../lib/data';
import { Icon } from './Icon';
import type { Card, Tx, NavDirection } from '../types';

type Navigate = (screen: string, params?: Record<string, unknown>, dir?: NavDirection) => void;

// ── Button ────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'dark' | 'muted';
type BtnSize = 'sm' | 'md' | 'lg';

interface BtnProps {
  children?: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Btn({ children, variant = 'primary', size = 'lg', onClick, disabled, loading, fullWidth = true, style = {} }: BtnProps) {
  const h = size === 'sm' ? 'clamp(36px, 10vw, 42px)' : size === 'md' ? 'clamp(44px, 12vw, 50px)' : 'clamp(48px, 14vw, 56px)';
  const fs = size === 'sm' ? 'clamp(12px, 3vw, 14px)' : 'clamp(14px, 4vw, 16px)';
  const base: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: h,
    width: fullWidth ? '100%' : 'auto',
    borderRadius: 'clamp(10px, 3vw, 14px)',
    border: 'none',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: fs,
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.5 : 1,
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
    padding: '0 clamp(12px, 5vw, 20px)',
    letterSpacing: 0.1,
    ...style,
  };
  const vars: Record<BtnVariant, CSSProperties> = {
    primary: { background: T.accent, color: '#fff', boxShadow: `0 4px 14px #10B98144` },
    secondary: { background: T.accentLight, color: T.accent },
    ghost: { background: 'transparent', color: T.text, border: `1.5px solid ${T.border}` },
    success: { background: T.accent, color: '#fff', boxShadow: `0 4px 14px #10B98144` },
    danger: { background: '#5A1A1A', color: T.error },
    dark: { background: T.surface, color: T.text },
    muted: { background: T.borderLight, color: T.muted },
  };
  const spinColor = variant === 'primary' || variant === 'success' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)';
  const spinTop = variant === 'primary' || variant === 'success' ? '#fff' : T.accent;
  return (
    <button style={{ ...base, ...vars[variant] }} onClick={onClick} disabled={disabled || loading}>
      {loading ? (
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2.5px solid ${spinColor}`, borderTopColor: spinTop, animation: 'spin 0.75s linear infinite' }} />
      ) : (
        children
      )}
    </button>
  );
}

// ── InputField ───────────────────────────────────────────────
interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  autoComplete?: string;
}

export function InputField({ label, value, onChange, type = 'text', placeholder, error, hint, prefix, autoComplete }: InputFieldProps) {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: 500, color: T.muted, letterSpacing: 0.2 }}>{label}</label>}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: T.surface,
          border: `1.5px solid ${error ? T.error : T.border}`,
          borderRadius: 'clamp(10px, 3vw, 14px)',
          padding: '0 16px',
          height: 'clamp(44px, 12vw, 56px)',
          transition: 'border-color 0.15s',
          boxShadow: error ? `0 0 0 3px ${T.error}22` : 'none',
        }}
      >
        {prefix && <span style={{ color: T.muted, flexShrink: 0, fontSize: 'clamp(13px, 3vw, 15px)' }}>{prefix}</span>}
        <input
          type={isPass && showPass ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: 'clamp(14px, 4vw, 16px)', color: T.text, WebkitTapHighlightColor: 'transparent' }}
        />
        {isPass && (
          <button onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Icon name={showPass ? 'eye-off' : 'eye'} size={20} color={T.muted} />
          </button>
        )}
      </div>
      {error && (
        <p style={{ margin: 0, fontSize: 'clamp(12px, 3vw, 13px)', color: T.error, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="info" size={13} color={T.error} />
          {error}
        </p>
      )}
      {hint && !error && <p style={{ margin: 0, fontSize: 'clamp(12px, 3vw, 13px)', color: T.muted }}>{hint}</p>}
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  bg?: string;
}

export function PageHeader({ title, onBack, right, bg = T.bg }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px', background: bg }}>
      {onBack ? (
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, background: T.surface, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', WebkitTapHighlightColor: 'transparent' }}>
          <Icon name="arrow-left" size={20} color={T.text} />
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <span style={{ fontSize: 17, fontWeight: 600, color: T.text, letterSpacing: -0.2 }}>{title}</span>
      {right || <div style={{ width: 40 }} />}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ name = '?', size = 42, color = T.accent }: { name?: string; size?: number; color?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.38, fontWeight: 600, color: '#fff', letterSpacing: 0.5, lineHeight: 1 }}>{F.initials(name)}</span>
    </div>
  );
}

// ── Category icons ────────────────────────────────────────────
export const CAT: Record<string, { bg: string; color: string; icon: string }> = {
  income: { bg: '#DCFCE7', color: '#16A34A', icon: 'income' },
  entertainment: { bg: '#EDE9FF', color: '#6B4FF4', icon: 'history' },
  shopping: { bg: '#FEF3C7', color: '#D97706', icon: 'card' },
  transport: { bg: '#DBEAFE', color: '#2563EB', icon: 'send' },
  food: { bg: '#FFE4E6', color: '#E11D48', icon: 'info' },
  utilities: { bg: '#F1F5F9', color: '#475569', icon: 'pay' },
  transfer: { bg: '#F0FDF4', color: '#16A34A', icon: 'transfer' },
};

export function CatIcon({ icon, size = 44 }: { icon: string; size?: number }) {
  const c = CAT[icon] || { bg: T.borderLight, color: T.muted, icon: 'card' };
  return (
    <div style={{ width: size, height: size, borderRadius: 14, background: c.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={c.icon} size={20} color={c.color} />
    </div>
  );
}

// ── Transaction Item ──────────────────────────────────────────
export function TxItem({ tx, onClick }: { tx: Tx; onClick?: () => void }) {
  const pos = tx.amount > 0;
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', cursor: onClick ? 'pointer' : 'default', WebkitTapHighlightColor: 'transparent' }}>
      <CatIcon icon={tx.icon} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</div>
        <div style={{ fontSize: 13, color: T.muted }}>{F.date(tx.date)} · {tx.category}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: pos ? T.success : T.text }}>{pos ? '+' : ''}{F.money(tx.amount)}</div>
      </div>
    </div>
  );
}

// ── Balance Card ──────────────────────────────────────────────
export function BalanceCard({ card, onClick, compact = false }: { card: Card; onClick?: () => void; compact?: boolean }) {
  const w = compact ? 252 : 338;
  const h = compact ? 158 : 213;
  const [g1, g2] = card.bg || ['#0E0C1A', '#1C1250'];
  const user = Auth.getUser();
  return (
    <div onClick={onClick} style={{ width: w, height: h, borderRadius: compact ? 20 : 24, background: `linear-gradient(135deg,${g1} 0%,${g2} 100%)`, position: 'relative', overflow: 'hidden', flexShrink: 0, cursor: onClick ? 'pointer' : 'default', boxShadow: '0 10px 30px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.14)' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -20, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
      <div style={{ position: 'absolute', top: compact ? 16 : 20, left: compact ? 16 : 20, display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: compact ? 26 : 30, height: compact ? 26 : 30, borderRadius: compact ? 7 : 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <span style={{ color: '#fff', fontSize: compact ? 12 : 14, fontWeight: 700 }}>V</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: compact ? 10 : 12, fontWeight: 600, letterSpacing: 1.5 }}>VAULT</span>
      </div>
      <div style={{ position: 'absolute', top: compact ? 16 : 20, right: compact ? 16 : 20 }}>
        {card.type === 'visa' ? (
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: compact ? 13 : 16, fontWeight: 700, fontStyle: 'italic', letterSpacing: 1 }}>VISA</span>
        ) : (
          <div style={{ display: 'flex' }}>
            <div style={{ width: compact ? 17 : 22, height: compact ? 17 : 22, borderRadius: '50%', background: '#EB001B', opacity: 0.8 }} />
            <div style={{ width: compact ? 17 : 22, height: compact ? 17 : 22, borderRadius: '50%', background: '#F79E1B', opacity: 0.8, marginLeft: compact ? -8 : -10 }} />
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', top: '44%', left: compact ? 16 : 20, width: compact ? 28 : 36, height: compact ? 20 : 26, background: 'linear-gradient(135deg,#E8C766,#C8A440)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1, padding: 2 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ background: 'rgba(0,0,0,0.12)', borderRadius: 1 }} />
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: compact ? 32 : 42, left: compact ? 16 : 20, color: 'rgba(255,255,255,0.8)', fontSize: compact ? 11 : 14, fontWeight: 500, letterSpacing: 2, fontFamily: 'monospace' }}>{card.full}</div>
      <div style={{ position: 'absolute', bottom: compact ? 10 : 14, left: compact ? 16 : 20, right: compact ? 16 : 20, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 1 }}>Holder</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: compact ? 10 : 12, fontWeight: 500 }}>{(user?.name || 'Card Holder').split(' ')[0] + ' ' + (user?.name || '').split(' ').pop()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 1 }}>Expires</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: compact ? 10 : 12, fontWeight: 500 }}>{card.expiry}</div>
        </div>
      </div>
      {card.frozen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,12,26,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: compact ? 20 : 24 }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.6 }}>❄<br />Card Frozen</div>
        </div>
      )}
    </div>
  );
}

// ── Bottom Navigation ─────────────────────────────────────────
export function BottomNav({ active, navigate }: { active: string; navigate: Navigate }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'wallet', label: 'Cards', icon: 'wallet' },
    { id: 'transfer', label: 'Send', icon: 'send', center: true },
    { id: 'transactions', label: 'History', icon: 'history' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', background: T.surface, borderTop: `1px solid ${T.border}`, paddingTop: 10, paddingBottom: 26, zIndex: 10 }}>
      {tabs.map((tab) => {
        const on = active === tab.id;
        if (tab.center)
          return (
            <button key={tab.id} onClick={() => navigate(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', marginTop: -18 }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${T.accent}44` }}>
                <Icon name={tab.icon} size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: on ? T.accent : T.faint }}>{tab.label}</span>
            </button>
          );
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Icon name={tab.icon} size={22} color={on ? T.accent : T.faint} />
              {on && <div style={{ position: 'absolute', bottom: -2, width: 4, height: 4, borderRadius: 2, background: T.accent }} />}
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: on ? T.accent : T.faint }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────
export function Divider({ my = 16 }: { my?: number }) {
  return <div style={{ height: 1, background: T.borderLight, margin: `${my}px 0` }} />;
}

// ── Section Header ────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <span style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{title}</span>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: T.accent, WebkitTapHighlightColor: 'transparent' }}>{action}</button>
      )}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 24, color = T.accent }: { size?: number; color?: string }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', border: `2.5px solid ${color}22`, borderTopColor: color, animation: 'spin 0.75s linear infinite', flexShrink: 0 }} />;
}

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ msg, type = 'success', onDone }: { msg: string; type?: 'success' | 'error' | 'info'; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const colors = { success: { bg: T.success, icon: 'check' }, error: { bg: T.error, icon: 'x' }, info: { bg: T.accent, icon: 'info' } };
  const c = colors[type] || colors.success;
  return (
    <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: c.bg, color: '#fff', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animation: 'slideInRight 0.3s ease-out', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
      <Icon name={c.icon} size={16} color="#fff" />
      {msg}
    </div>
  );
}
