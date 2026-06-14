// Admin screens — Login, Dashboard, Customer detail/controls.
// Ported from bank-admin-screens.jsx.

import { useState } from 'react';
import { T } from '../theme';
import { V, F } from '../lib/data';
import { Admin } from '../lib/admin';
import type { AdminUserDetails } from '../lib/admin';
import { Icon } from '../components/Icon';
import { Btn, InputField, PageHeader, TxItem } from '../components/ui';
import { mintCapitalLogo } from '../lib/assets';
import type { ScreenProps } from '../types';

// ── Admin Login ───────────────────────────────────────────────
export function AdminLoginScreen({ navigate }: ScreenProps) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState<{ email?: string; pass?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState('');

  const submit = () => {
    const e: { email?: string; pass?: string } = {};
    if (!V.notEmpty(email)) e.email = 'Email required';
    else if (!V.email(email)) e.email = 'Invalid email';
    if (!V.notEmpty(pass)) e.pass = 'Password required';
    setErrors(e);
    setApiErr('');
    if (Object.keys(e).length) return;

    setLoading(true);
    setTimeout(() => {
      const res = Admin.login(email.trim(), pass);
      setLoading(false);
      if (res.ok) navigate('adminDash', {}, 'forward');
      else setApiErr(res.error || 'Login failed');
    }, 600);
  };

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 62, overflowY: 'auto' }}>
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: 36 }}>
            <img src={mintCapitalLogo} style={{ width: 52, height: 52, borderRadius: 16, marginBottom: 20, boxShadow: `0 8px 20px #10B98133`, objectFit: 'contain' }} />
            <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: -0.5, marginBottom: 6 }}>Mint Capital Admin</h1>
            <p style={{ fontSize: 15, color: T.muted, margin: 0 }}>Manage customers & accounts</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <InputField label="Email" value={email} onChange={setEmail} type="email" placeholder="admin@mintcapital.app" error={errors.email} autoComplete="email" />
            <InputField label="Password" value={pass} onChange={setPass} type="password" placeholder="Your password" error={errors.pass} autoComplete="current-password" />
          </div>
          {apiErr && (
            <div style={{ background: T.errorLight, borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Icon name="info" size={16} color={T.error} style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: T.error }}>{apiErr}</span>
            </div>
          )}
          <Btn onClick={submit} loading={loading}>Sign in to Admin</Btn>
        </div>
        <button onClick={() => navigate('login', {}, 'back')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: T.muted, WebkitTapHighlightColor: 'transparent' }}>Back to customer login</button>
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────
export function AdminDashScreen({ navigate }: ScreenProps) {
  const [users] = useState(Admin.getAllUsers());
  const [search, setSearch] = useState('');
  const admin = Admin.getAdmin();

  const filtered = users.filter((u) => search === '' || u.email.toLowerCase().includes(search.toLowerCase()) || (u.name && u.name.toLowerCase().includes(search.toLowerCase())));

  const logout = () => {
    Admin.logout();
    navigate('adminLogin', {}, 'none');
  };

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 24px', background: T.surface, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.text }}>💰 Mint Capital</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: T.muted }}>{admin?.name}</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', borderRadius: 10, background: T.accentLight, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: T.accent, WebkitTapHighlightColor: 'transparent' }}>Logout</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: T.text }}>Manage {users.length} customers</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.surface, borderRadius: 14, padding: '0 16px', height: 48, border: `1.5px solid ${T.border}`, marginBottom: 16 }}>
          <Icon name="search" size={18} color={T.muted} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.text }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((u) => (
            <div key={u.email} onClick={() => navigate('adminCustomer', { email: u.email }, 'forward')} style={{ background: T.surface, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{F.initials(u.name || 'User')}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{u.email}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{F.money(u.balance)}</div>
                <div style={{ fontSize: 11, color: T.faint }}>{u.txCount} transactions</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: T.faint }}>
              <p style={{ margin: 0, fontSize: 15 }}>No customers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Customer Details & Controls ────────────────────────────────
export function AdminCustomerScreen(props: ScreenProps) {
  const { navigate } = props;
  const email = props.email as string | undefined;
  const [customer, setCustomer] = useState<AdminUserDetails | null>(email ? Admin.getUserDetails(email) : null);
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!customer || !email) {
    return (
      <div style={{ height: '100%', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: T.muted }}>
          <p>Customer not found</p>
          <button onClick={() => navigate('adminDash', {}, 'back')} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 10, background: T.accent, border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600, WebkitTapHighlightColor: 'transparent' }}>Back</button>
        </div>
      </div>
    );
  }

  const addBalance = () => {
    if (!addAmount || isNaN(Number(addAmount)) || parseFloat(addAmount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      const res = Admin.addBalance(email, parseFloat(addAmount));
      if (res.ok) {
        setCustomer(Admin.getUserDetails(email));
        setAddAmount('');
      }
      setLoading(false);
    }, 600);
  };

  const handleKYC = (action: 'approve' | 'reject') => {
    setLoading(true);
    setTimeout(() => {
      if (action === 'approve') Admin.approveKYC(email);
      else Admin.rejectKYC(email, 'Rejected by admin');
      setCustomer(Admin.getUserDetails(email));
      setLoading(false);
    }, 600);
  };

  const freezeAccount = () => {
    setLoading(true);
    setTimeout(() => {
      if (!customer.frozen) Admin.freezeAccount(email);
      else Admin.unfreezeAccount(email);
      setCustomer(Admin.getUserDetails(email));
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', paddingTop: 62, overflowY: 'auto' }}>
      <PageHeader title={customer.name} onBack={() => navigate('adminDash', {}, 'back')} />

      <div style={{ padding: '16px 24px' }}>
        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: T.muted, fontWeight: 500 }}>Email</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{customer.email}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: 12, color: T.muted, fontWeight: 500 }}>Joined</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{customer.joined || 'Unknown'}</p>
            </div>
          </div>
          {customer.phone && (
            <div>
              <p style={{ margin: 0, fontSize: 12, color: T.muted, fontWeight: 500 }}>Phone</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{customer.phone}</p>
            </div>
          )}
        </div>

        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>Balance Management</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: T.muted }}>Current Balance</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>{F.money(customer.balance)}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="Amount" style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, color: T.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} />
            <Btn onClick={addBalance} loading={loading} size="md" fullWidth={false}>Add</Btn>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>KYC Status</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: T.text }}>Verification</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: customer.kycStatus?.approved ? T.success : T.warning, background: customer.kycStatus?.approved ? T.successLight : 'rgba(245,158,11,0.15)', padding: '4px 10px', borderRadius: 6 }}>
              {customer.kycStatus?.approved ? 'Approved' : 'Pending'}
            </span>
          </div>
          {!customer.kycStatus?.approved && (
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn onClick={() => handleKYC('approve')} loading={loading} variant="success" size="md" fullWidth={false}>Approve</Btn>
              <Btn onClick={() => handleKYC('reject')} loading={loading} variant="danger" size="md" fullWidth={false}>Reject</Btn>
            </div>
          )}
        </div>

        <div style={{ background: customer.frozen ? '#3A1A1A' : T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: customer.frozen ? '#FF6B6B' : T.text }}>Account Controls</p>
          <button onClick={freezeAccount} disabled={loading} style={{ width: '100%', padding: '10px 16px', borderRadius: 10, border: 'none', background: customer.frozen ? '#5A2A2A' : T.accentLight, color: customer.frozen ? '#FF6B6B' : T.accent, fontWeight: 600, fontSize: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            {customer.frozen ? '🔒 Unfreeze Account' : '❄ Freeze Account'}
          </button>
        </div>

        <div>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>Recent Transactions</p>
          <div style={{ background: T.surface, borderRadius: 20, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {customer.transactions.slice(0, 5).map((tx, i) => (
              <div key={tx.id}>
                <TxItem tx={tx} />
                {i < Math.min(4, customer.transactions.length - 1) && <div style={{ height: 1, background: T.borderLight }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
