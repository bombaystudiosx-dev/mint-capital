// Action screens — Transfer flow, Profile, Security.
// Ported from bank-action-screens.jsx.

import { useState } from 'react';
import { T } from '../theme';
import { Auth, BankAPI, V, F } from '../lib/data';
import { Icon } from '../components/Icon';
import { Btn, InputField, PageHeader } from '../components/ui';
import type { Recipient, ScreenProps } from '../types';

// ── Transfer (select recipient) ───────────────────────────────
export function TransferScreen({ navigate }: ScreenProps) {
  const [rcpts] = useState<Recipient[]>(BankAPI.getRecipients());
  const [query, setQuery] = useState('');

  const filtered = rcpts.filter((r) => query === '' || r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase()));

  const pick = (r: Recipient) => navigate('transferAmount', { recipient: r }, 'forward');

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      <PageHeader title="Send money" onBack={() => navigate('home', {}, 'back')} />
      <div style={{ padding: '8px 24px 0' }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: T.muted, letterSpacing: 0.3 }}>RECENT</p>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          <button onClick={() => navigate('addRecipient', {}, 'forward')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', flexShrink: 0 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${T.accent}` }}>
              <Icon name="plus" size={22} color={T.accent} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.accent, whiteSpace: 'nowrap' }}>New</span>
          </button>
          {rcpts.slice(0, 5).map((r) => (
            <button key={r.id} onClick={() => pick(r)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', flexShrink: 0 }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{r.initials}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: T.text, whiteSpace: 'nowrap', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.surface, borderRadius: 14, padding: '0 16px', height: 48, border: `1.5px solid ${T.border}`, margin: '20px 0 16px' }}>
          <Icon name="search" size={18} color={T.muted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.text }} />
        </div>

        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: T.muted, letterSpacing: 0.3 }}>ALL CONTACTS</p>
        <div style={{ background: T.surface, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.faint }}>
              <p style={{ margin: 0, fontSize: 14 }}>No recipients found</p>
            </div>
          ) : (
            filtered.map((r, i) => (
              <div key={r.id}>
                <div onClick={() => pick(r)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{r.initials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: T.muted }}>{r.email}</div>
                  </div>
                  <Icon name="chevron-right" size={18} color={T.faint} />
                </div>
                {i < filtered.length - 1 && <div style={{ height: 1, background: T.borderLight, marginLeft: 74 }} />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Add Recipient ─────────────────────────────────────────────
export function AddRecipientScreen({ navigate }: ScreenProps) {
  const [f, setF] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const submit = () => {
    const e: Record<string, string> = {};
    if (!V.name(f.name)) e.name = 'Enter a full name';
    if (!V.notEmpty(f.email)) e.email = 'Email is required';
    else if (!V.email(f.email)) e.email = 'Enter a valid email';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      const r = BankAPI.addRecipient(f);
      setLoading(false);
      navigate('transferAmount', { recipient: r }, 'forward');
    }, 700);
  };

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 0, overflowY: 'auto' }}>
      <PageHeader title="Add recipient" onBack={() => navigate('transfer', {}, 'back')} bg={T.surface} />
      <div style={{ padding: '16px 24px 28px', flex: 1 }}>
        <p style={{ margin: '0 0 28px', fontSize: 15, color: T.muted, lineHeight: 1.5 }}>Add a new person to send money to.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          <InputField label="Full name" value={f.name} onChange={(v) => set('name', v)} placeholder="Alex Johnson" error={errors.name} />
          <InputField label="Email address" value={f.email} onChange={(v) => set('email', v)} type="email" placeholder="alex@example.com" error={errors.email} />
        </div>
        <Btn onClick={submit} loading={loading}>Continue</Btn>
      </div>
    </div>
  );
}

// ── Transfer Amount ───────────────────────────────────────────
export function TransferAmountScreen(props: ScreenProps) {
  const { navigate } = props;
  const recipient = props.recipient as Recipient | undefined;
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const balance = BankAPI.getBalance();

  const press = (k: string) => {
    setErr('');
    setAmount((prev) => {
      if (k === '⌫') return prev.length <= 1 ? '0' : prev.slice(0, -1);
      if (k === '.') return prev.includes('.') ? prev : prev === '0' ? '0.' : prev + '.';
      if (prev === '0' && k !== '.') return k;
      const next = prev + k;
      if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev;
      return next;
    });
  };

  const numAmt = parseFloat(amount) || 0;

  const proceed = () => {
    if (numAmt <= 0) {
      setErr('Enter an amount');
      return;
    }
    if (numAmt > balance) {
      setErr('Insufficient balance');
      return;
    }
    if (numAmt > 50000) {
      setErr('Maximum transfer is $50,000');
      return;
    }
    navigate('confirmTransfer', { recipient, amount: numAmt, note }, 'forward');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Send money" onBack={() => navigate('transfer', {}, 'back')} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, gap: 8 }}>
        <div style={{ width: 60, height: 60, borderRadius: 30, background: recipient?.color || T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${recipient?.color || T.accent}44` }}>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{recipient?.initials || '?'}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>{recipient?.name || 'Recipient'}</div>
          <div style={{ fontSize: 13, color: T.muted }}>{recipient?.email || ''}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: T.muted, marginBottom: 6 }}>$</span>
          <span style={{ fontSize: 52, fontWeight: 800, color: T.text, letterSpacing: -2, minWidth: 80, textAlign: 'center' }}>{amount}</span>
        </div>
        {err && <p style={{ margin: 0, fontSize: 14, color: T.error, fontWeight: 500 }}>{err}</p>}
        <p style={{ margin: 0, fontSize: 13, color: T.muted }}>Available: <strong style={{ color: T.text }}>{F.money(balance)}</strong></p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.surface, borderRadius: 12, padding: '8px 16px', border: `1px solid ${T.border}`, marginTop: 8, width: 260 }}>
          <Icon name="pay" size={16} color={T.muted} />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: T.text }} />
        </div>
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
          {keys.map((k) => (
            <button key={k} onClick={() => press(k)} style={{ height: 58, borderRadius: 16, background: k === '⌫' ? T.accentLight : T.surface, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", fontSize: k === '⌫' ? 20 : 22, fontWeight: 600, color: k === '⌫' ? T.accent : T.text, boxShadow: '0 2px 6px rgba(0,0,0,0.2)', WebkitTapHighlightColor: 'transparent', transition: 'transform 0.08s' }}>
              {k}
            </button>
          ))}
        </div>
        <Btn onClick={proceed} disabled={numAmt <= 0}>Continue</Btn>
      </div>
    </div>
  );
}

// ── Confirm Transfer ──────────────────────────────────────────
export function ConfirmTransferScreen(props: ScreenProps) {
  const { navigate } = props;
  const recipient = props.recipient as Recipient | undefined;
  const amount = props.amount as number | undefined;
  const note = props.note as string | undefined;
  const [loading, setLoading] = useState(false);
  const fee = 0.0;
  const total = (amount || 0) + fee;
  const user = Auth.getUser();

  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      const tx = recipient && amount != null ? BankAPI.sendMoney(recipient, amount, note) : null;
      setLoading(false);
      navigate('transferSuccess', { recipient, amount, txId: tx?.id }, 'forward');
    }, 1200);
  };

  const rows: { label: string; value: React.ReactNode; sub?: string }[] = [
    { label: 'From', value: user?.name || 'You', sub: user?.email || '' },
    { label: 'To', value: recipient?.name || 'Recipient', sub: recipient?.email || '' },
    { label: 'Transfer fee', value: F.money(fee) },
    { label: 'Total deducted', value: <strong style={{ color: T.text }}>{F.money(total)}</strong> },
  ];

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Confirm transfer" onBack={() => navigate('transferAmount', { recipient, amount, note }, 'back')} />
      <div style={{ flex: 1, padding: '16px 24px', overflowY: 'auto' }}>
        <div style={{ background: 'linear-gradient(135deg,#1A1025,#2A1A35)', borderRadius: 24, padding: '28px 24px', textAlign: 'center', marginBottom: 20, boxShadow: '0 8px 24px rgba(14,12,26,0.4)' }}>
          <p style={{ margin: '0 0 6px', color: 'rgba(255,255,255,0.5)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>You're sending</p>
          <p style={{ margin: 0, color: '#fff', fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>{F.money(amount || 0)}</p>
        </div>
        <div style={{ background: T.surface, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', marginBottom: 20 }}>
          {rows.map((row, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' }}>
                <div>
                  <div style={{ fontSize: 13, color: T.muted, marginBottom: 1 }}>{row.label}</div>
                  {row.sub && <div style={{ fontSize: 13, color: T.faint }}>{row.sub}</div>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: T.text, textAlign: 'right' }}>{row.value}</div>
              </div>
              {i < 3 && <div style={{ height: 1, background: T.borderLight }} />}
            </div>
          ))}
          {note && (
            <>
              <div style={{ height: 1, background: T.borderLight }} />
              <div style={{ padding: '14px 18px' }}>
                <div style={{ fontSize: 13, color: T.muted, marginBottom: 2 }}>Note</div>
                <div style={{ fontSize: 14, color: T.text }}>{note}</div>
              </div>
            </>
          )}
        </div>
        <Btn onClick={confirm} loading={loading} variant="success">
          <Icon name="check" size={18} color="#fff" />
          Confirm & Send
        </Btn>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button onClick={() => navigate('transfer', {}, 'back')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: T.muted, WebkitTapHighlightColor: 'transparent' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Transfer Success ──────────────────────────────────────────
export function TransferSuccessScreen(props: ScreenProps) {
  const { navigate } = props;
  const recipient = props.recipient as Recipient | undefined;
  const amount = props.amount as number | undefined;
  const txId = props.txId as string | undefined;
  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px 80px' }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: T.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, animation: 'popIn 0.5s ease-out', boxShadow: `0 12px 30px ${T.success}44` }}>
        <Icon name="check" size={48} color={T.success} />
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' }}>Transfer complete!</h2>
      <p style={{ fontSize: 16, color: T.muted, textAlign: 'center', lineHeight: 1.6, margin: '0 0 32px' }}>
        <strong style={{ color: T.text }}>{F.money(amount || 0)}</strong> was sent to<br />
        <strong style={{ color: T.text }}>{recipient?.name}</strong>
      </p>
      <div style={{ background: T.surface, borderRadius: 14, padding: '12px 20px', marginBottom: 32, border: `1px solid ${T.border}` }}>
        <p style={{ margin: 0, fontSize: 12, color: T.faint, letterSpacing: 0.5, marginBottom: 3, textTransform: 'uppercase' }}>Transaction ID</p>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.muted, fontFamily: 'monospace' }}>{txId || 'TX' + Date.now()}</p>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn onClick={() => navigate('transactions', {}, 'none')} variant="secondary">View transaction</Btn>
        <Btn onClick={() => navigate('home', {}, 'none')} variant="ghost">Back to home</Btn>
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────
export function ProfileScreen({ navigate }: ScreenProps) {
  const user = Auth.getUser();
  const initial = F.initials(user?.name || 'U');

  const menuSections = [
    {
      items: [
        { icon: 'user', label: 'Personal info', sub: 'Name, email, phone' },
        { icon: 'card', label: 'My cards', sub: 'Manage your cards', screen: 'wallet' },
      ],
    },
    {
      items: [
        { icon: 'shield', label: 'Security settings', sub: 'PIN, biometrics', screen: 'security' },
        { icon: 'bell', label: 'Notifications', sub: 'Alerts & updates', screen: 'notifications' },
        { icon: 'help', label: 'Help & support', sub: 'FAQs, contact us' },
        { icon: 'pay', label: 'Terms & Privacy', sub: 'Legal documents' },
      ],
    },
  ];

  const logout = () => {
    Auth.logout();
    navigate('login', {}, 'none');
  };

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      <div style={{ padding: '20px 24px 0' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.4, marginBottom: 20 }}>Profile</h2>
        <div style={{ background: T.surface, borderRadius: 20, padding: '20px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg,${T.accent},#9B8FFF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${T.accent}55` }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 2 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 14, color: T.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</div>
            {user?.phone && <div style={{ fontSize: 13, color: T.faint, marginTop: 1 }}>{user.phone}</div>}
          </div>
          <div style={{ background: T.accentLight, borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>Premium</span>
          </div>
        </div>

        {menuSections.map((sec, si) => (
          <div key={si} style={{ background: T.surface, borderRadius: 20, overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            {sec.items.map((item, ii) => (
              <div key={ii}>
                <div onClick={() => 'screen' in item && item.screen && navigate(item.screen, {}, 'forward')} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={item.icon} size={18} color={T.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: T.muted }}>{item.sub}</div>
                  </div>
                  <Icon name="chevron-right" size={16} color={T.faint} />
                </div>
                {ii < sec.items.length - 1 && <div style={{ height: 1, background: T.borderLight, marginLeft: 72 }} />}
              </div>
            ))}
          </div>
        ))}

        <div style={{ background: '#3A1A1A', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#5A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="logout" size={18} color="#FF6B6B" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#FF6B6B', flex: 1 }}>Log out</span>
            <Icon name="chevron-right" size={16} color="#8B4A4A" />
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: T.faint, margin: '20px 0 0' }}>Vault v1.0.0 · Secured by 256-bit SSL</p>
      </div>
    </div>
  );
}

// ── Security Settings ─────────────────────────────────────────
function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!val)} style={{ width: 48, height: 28, borderRadius: 14, background: val ? T.accent : T.border, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', position: 'absolute', top: 3, left: val ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
    </div>
  );
}

export function SecurityScreen({ navigate }: ScreenProps) {
  const [faceId, setFaceId] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [twoFa, setTwoFa] = useState(false);

  const authItems = [
    { icon: 'fingerprint', label: 'Face ID / Biometrics', sub: 'Use biometrics to sign in', val: faceId, set: setFaceId },
    { icon: 'bell', label: 'Login alerts', sub: 'Get notified of new logins', val: alerts, set: setAlerts },
    { icon: 'shield', label: 'Two-factor auth', sub: 'Extra security via SMS', val: twoFa, set: setTwoFa },
  ];

  const sessions = [
    { device: 'iPhone 16 Pro', loc: 'San Francisco, CA', time: 'Active now', current: true },
    { device: 'Chrome — MacOS', loc: 'San Francisco, CA', time: '2 days ago', current: false },
  ];

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      <PageHeader title="Security" onBack={() => navigate('profile', {}, 'back')} />
      <div style={{ padding: '8px 24px 0' }}>
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Authentication</p>
        <div style={{ background: T.surface, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', marginBottom: 20 }}>
          {authItems.map((item, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={item.icon} size={18} color={T.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: T.muted }}>{item.sub}</div>
                </div>
                <Toggle val={item.val} onChange={item.set} />
              </div>
              {i < 2 && <div style={{ height: 1, background: T.borderLight, marginLeft: 72 }} />}
            </div>
          ))}
        </div>

        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Active sessions</p>
        <div style={{ background: T.surface, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', marginBottom: 20 }}>
          {sessions.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: s.current ? T.successLight : T.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={s.current ? 'phone' : 'gear'} size={18} color={s.current ? T.success : T.muted} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{s.device}</div>
                  <div style={{ fontSize: 13, color: T.muted }}>{s.loc} · {s.time}</div>
                </div>
                {s.current && <span style={{ fontSize: 11, fontWeight: 600, color: T.success, background: T.successLight, padding: '3px 8px', borderRadius: 6 }}>This device</span>}
              </div>
              {i < sessions.length - 1 && <div style={{ height: 1, background: T.borderLight, marginLeft: 72 }} />}
            </div>
          ))}
        </div>

        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Account</p>
        <div style={{ background: T.surface, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          {['Change password', 'Delete account'].map((label, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer' }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: i === 1 ? T.error : T.text }}>{label}</span>
                <Icon name="chevron-right" size={16} color={T.faint} />
              </div>
              {i === 0 && <div style={{ height: 1, background: T.borderLight }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
