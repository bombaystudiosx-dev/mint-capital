// Auth screens — Splash, Onboarding, Login, SignUp, ForgotPassword.
// Ported from bank-auth-screens.jsx.

import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { T } from '../theme';
import { Auth, V } from '../lib/data';
import { Icon } from '../components/Icon';
import { Btn, InputField, PageHeader } from '../components/ui';
import { mintCapitalLogo, heroImageDataUrl } from '../lib/assets';
import type { ScreenProps } from '../types';

// ── Splash ────────────────────────────────────────────────────
export function SplashScreen({ navigate }: ScreenProps) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (Auth.isAuthed()) navigate('home', {}, 'none');
      else if (Auth.hasOnboarded()) navigate('login', {}, 'none');
      else navigate('onboarding', {}, 'none');
    }, 2400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', background: 'linear-gradient(160deg,#0A0A0A 0%,#0D1A14 50%,#0A0A0A 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', paddingTop: 'max(20px, env(safe-area-inset-top))' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(200px, 60vw, 320px)', height: 'clamp(200px, 60vw, 320px)', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.15)', animation: 'pulse 3s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'clamp(150px, 50vw, 220px)', height: 'clamp(150px, 50vw, 220px)', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.25)', animation: 'pulse 3s ease-in-out infinite 0.5s' }} />
      <div style={{ animation: 'popIn 0.6s ease-out 0.3s both', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <img src={mintCapitalLogo} style={{ width: 'clamp(60px, 20vw, 88px)', height: 'clamp(60px, 20vw, 88px)', borderRadius: 26, boxShadow: '0 20px 50px rgba(16,185,129,0.55),0 0 0 1px rgba(255,255,255,0.08)', objectFit: 'contain' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: 'clamp(24px, 7vw, 32px)', fontWeight: 800, letterSpacing: -1, fontFamily: "'DM Sans',sans-serif" }}>Mint Capital</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(13px, 4vw, 15px)', marginTop: 6, letterSpacing: 0.5 }}>Banking, reimagined.</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 80, display: 'flex', gap: 8, animation: 'fadeIn 0.5s ease-out 1s both' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(16,185,129,0.6)', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ── Onboarding ────────────────────────────────────────────────
interface Slide {
  title: string;
  sub: string;
  illus: () => JSX.Element;
}

const SLIDES: Slide[] = [
  {
    title: 'Smart Banking',
    sub: 'Get a real-time view of your finances, spending insights, and balance across all your cards.',
    illus: () => (
      <div style={{ position: 'relative', width: 280, height: 200, margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 220, height: 140, borderRadius: 20, background: 'linear-gradient(135deg,#1A3A2E,#0F1F1A)', boxShadow: '0 16px 40px rgba(16,185,129,0.35)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>M</span></div>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 600, letterSpacing: 1 }}>MINT</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700, fontStyle: 'italic' }}>VISA</span>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, letterSpacing: 1, marginBottom: 2 }}>BALANCE</div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>$24,850</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: 10, justifyContent: 'center' }}>
          {[{ l: 'Income', v: '+$6.4k', c: '#10B981' }, { l: 'Spent', v: '-$532', c: '#10B981' }].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, letterSpacing: 0.5, marginBottom: 3 }}>{s.l}</div>
              <div style={{ color: s.c, fontSize: 15, fontWeight: 700 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Send Instantly',
    sub: 'Transfer money to anyone in seconds. No hidden fees. No waiting.',
    illus: () => (
      <div style={{ position: 'relative', width: 280, height: 200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {[{ n: 'AJ', c: '#6B4FF4', x: -90 }, { n: 'SM', c: '#06D6A0', x: 90 }].map((a, i) => (
          <div key={i} style={{ position: 'absolute', left: `calc(50% + ${a.x}px)`, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: a.c, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${a.c}55` }}>
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{a.n}</span>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}>
          <div style={{ background: T.accent, borderRadius: 12, padding: '6px 14px', boxShadow: `0 4px 14px ${T.accent}55` }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>$250</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ width: 12, height: 2, background: 'rgba(107,79,244,0.4)', marginRight: 2, borderRadius: 1, animation: `pulse 1s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
            <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${T.accent}` }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 0.5 }}>0.3 seconds</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Always Secure',
    sub: 'Bank-grade 256-bit encryption with biometric authentication and real-time fraud alerts.',
    illus: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 110, height: 110 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(107,79,244,0.3)', animation: 'pulse 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid rgba(107,79,244,0.5)' }} />
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(107,79,244,0.2),rgba(107,79,244,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield" size={46} color="#9B7BFF" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['256-bit SSL', 'Biometric', '2FA'].map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="check" size={12} color="#16A34A" />
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function OnboardingScreen({ navigate }: ScreenProps) {
  const [idx, setIdx] = useState(0);
  const s = SLIDES[idx];

  const next = () => {
    if (idx < SLIDES.length - 1) {
      setIdx(idx + 1);
    } else {
      Auth.setOnboarded();
      navigate('login', {}, 'forward');
    }
  };
  const skip = () => {
    Auth.setOnboarded();
    navigate('login', {}, 'forward');
  };

  return (
    <div style={{ height: '100%', background: 'linear-gradient(160deg,#0A0A0A 0%,#15080F 100%)', display: 'flex', flexDirection: 'column', paddingTop: 'max(0px, env(safe-area-inset-top))', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'clamp(10px, 2vw, 12px) clamp(16px, 5vw, 24px) 0' }}>
        {idx < SLIDES.length - 1 && (
          <button onClick={skip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 500, WebkitTapHighlightColor: 'transparent' }}>Skip</button>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px, 5vw, 24px)' }}>
        <div key={idx} style={{ animation: 'fadeIn 0.4s ease-out', width: '100%' }}>
          <s.illus />
        </div>
      </div>
      <div style={{ padding: '0 clamp(16px, 5vw, 32px) clamp(24px, 6vw, 48px)' }}>
        <div key={'t' + idx} style={{ animation: 'fadeIn 0.4s ease-out', marginBottom: 'clamp(20px, 5vw, 32px)' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(22px, 6vw, 28px)', fontWeight: 800, letterSpacing: -0.5, marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>{s.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: 1.6, margin: 0 }}>{s.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 7, marginBottom: 'clamp(20px, 5vw, 28px)' }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ height: 5, borderRadius: 3, background: i === idx ? T.accent : 'rgba(255,255,255,0.15)', width: i === idx ? 24 : 8, transition: 'all 0.3s ease', cursor: 'pointer' }} />
          ))}
        </div>
        <Btn onClick={next} size="lg">{idx < SLIDES.length - 1 ? 'Continue' : 'Get Started'}</Btn>
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────
export function LoginScreen({ navigate }: ScreenProps) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState<{ email?: string; pass?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState('');

  const validate = () => {
    const e: { email?: string; pass?: string } = {};
    if (!V.notEmpty(email)) e.email = 'Email is required';
    else if (!V.email(email)) e.email = 'Enter a valid email';
    if (!V.notEmpty(pass)) e.pass = 'Password is required';
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    setApiErr('');
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      const res = Auth.login(email.trim(), pass);
      setLoading(false);
      if (res.ok) navigate('home', {}, 'forward');
      else setApiErr(res.error || 'Login failed');
    }, 900);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 'max(0px, env(safe-area-inset-top))', overflowY: 'auto', position: 'relative', backgroundImage: `url(${heroImageDataUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.7) 100%)', zIndex: 1 }} />
      <div style={{ flex: 1, padding: 'clamp(20px, 6vw, 32px) clamp(16px, 5vw, 28px) clamp(16px, 5vw, 28px)', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 'clamp(20px, 5vw, 36px)' }}>
          <img src={mintCapitalLogo} style={{ width: 'clamp(44px, 12vw, 52px)', height: 'clamp(44px, 12vw, 52px)', borderRadius: 16, marginBottom: 'clamp(12px, 3vw, 20px)', boxShadow: `0 8px 20px #10B98133`, objectFit: 'contain' }} />
          <h1 style={{ fontSize: 'clamp(22px, 6vw, 28px)', fontWeight: 800, color: T.text, letterSpacing: -0.5, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: T.muted, margin: 0 }}>Sign in to your Mint Capital account</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)', marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <InputField label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" error={errors.email} autoComplete="email" />
          <InputField label="Password" value={pass} onChange={setPass} type="password" placeholder="Your password" error={errors.pass} autoComplete="current-password" />
        </div>
        <div style={{ textAlign: 'right', marginBottom: 'clamp(16px, 4vw, 28px)' }}>
          <button onClick={() => navigate('forgot', {}, 'forward')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 500, color: T.accent, WebkitTapHighlightColor: 'transparent' }}>Forgot password?</button>
        </div>
        {apiErr && (
          <div style={{ background: T.errorLight, borderRadius: 'clamp(10px, 3vw, 12px)', padding: 'clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Icon name="info" size={16} color={T.error} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: T.error }}>{apiErr}</span>
          </div>
        )}
        <Btn onClick={submit} loading={loading}>Sign in</Btn>
      </div>
      <div style={{ padding: '0 clamp(16px, 5vw, 28px) clamp(24px, 6vw, 40px)', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <span style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: T.muted }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('signup', {}, 'forward')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(13px, 3.5vw, 15px)', fontWeight: 600, color: T.accent, WebkitTapHighlightColor: 'transparent' }}>Sign up</button>
        </span>
        <div style={{ height: 1, background: T.borderLight }} />
        <button onClick={() => navigate('adminLogin', {}, 'forward')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: 500, color: T.faint, WebkitTapHighlightColor: 'transparent' }}>Admin access</button>
      </div>
    </div>
  );
}

// ── Sign Up ───────────────────────────────────────────────────
export function SignUpScreen({ navigate }: ScreenProps) {
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState('');

  const set = (k: string, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
    setApiErr('');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!V.name(f.name)) e.name = 'Enter your full name';
    if (!V.notEmpty(f.email)) e.email = 'Email is required';
    else if (!V.email(f.email)) e.email = 'Enter a valid email';
    if (!V.notEmpty(f.phone)) e.phone = 'Phone is required';
    else if (!V.phone(f.phone)) e.phone = 'Enter a valid phone number';
    if (!V.password(f.password)) e.password = 'Password must be at least 8 characters';
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const pwStrength = V.strength(f.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', T.error, T.warning, '#65A30D', T.success];

  const submit = () => {
    const e = validate();
    setErrors(e);
    setApiErr('');
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      const res = Auth.register({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), password: f.password });
      setLoading(false);
      if (res.ok) navigate('home', {}, 'forward');
      else setApiErr(res.error || 'Sign up failed');
    }, 1100);
  };

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 62, overflowY: 'auto' }}>
      <div style={{ padding: '16px 28px 28px' }}>
        <PageHeader title="Create account" onBack={() => navigate('login', {}, 'back')} bg={T.surface} />
        <p style={{ fontSize: 15, color: T.muted, margin: '4px 0 28px' }}>Join Vault and start banking smarter.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <InputField label="Full name" value={f.name} onChange={(v) => set('name', v)} placeholder="Alex Morgan" error={errors.name} autoComplete="name" />
          <InputField label="Email address" value={f.email} onChange={(v) => set('email', v)} type="email" placeholder="you@example.com" error={errors.email} autoComplete="email" />
          <InputField label="Phone number" value={f.phone} onChange={(v) => set('phone', v)} type="tel" placeholder="+1 415 000 0000" prefix="📱" error={errors.phone} autoComplete="tel" />
          <div>
            <InputField label="Password" value={f.password} onChange={(v) => set('password', v)} type="password" placeholder="Min. 8 characters" error={errors.password} autoComplete="new-password" />
            {f.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pwStrength ? strengthColors[pwStrength] : T.borderLight, transition: 'background 0.2s' }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: strengthColors[pwStrength] || T.muted, fontWeight: 500 }}>{strengthLabels[pwStrength] || ''}</span>
              </div>
            )}
          </div>
          <InputField label="Confirm password" value={f.confirm} onChange={(v) => set('confirm', v)} type="password" placeholder="Re-enter password" error={errors.confirm} autoComplete="new-password" />
        </div>
        {apiErr && (
          <div style={{ background: T.errorLight, borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 8 }}>
            <Icon name="info" size={15} color={T.error} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 14, color: T.error }}>{apiErr}</span>
          </div>
        )}
        <Btn onClick={submit} loading={loading}>Create account</Btn>
        <p style={{ textAlign: 'center', fontSize: 12, color: T.faint, margin: '16px 0 0', lineHeight: 1.5 }}>
          By creating an account you agree to our <span style={{ color: T.accent }}>Terms of Service</span> and <span style={{ color: T.accent }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

// ── Forgot Password ───────────────────────────────────────────
export function ForgotScreen({ navigate }: ScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!V.notEmpty(email)) {
      setError('Email is required');
      return;
    }
    if (!V.email(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1100);
  };

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 62, overflowY: 'auto' }}>
      <PageHeader title="Reset password" onBack={() => navigate('login', {}, 'back')} bg={T.surface} />
      <div style={{ flex: 1, padding: '24px 28px 28px', display: 'flex', flexDirection: 'column' }}>
        {!sent ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon name="lock" size={26} color={T.accent} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 8 }}>Forgot your password?</h2>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.6, margin: 0 }}>No worries! Enter your email and we'll send you a reset link.</p>
            </div>
            <InputField label="Email address" value={email} onChange={(v) => { setEmail(v); setError(''); }} type="email" placeholder="you@example.com" error={error} autoComplete="email" />
            <div style={{ marginTop: 24 }}>
              <Btn onClick={submit} loading={loading}>Send reset link</Btn>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 20, animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: T.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s ease-out' }}>
              <Icon name="check" size={36} color={T.success} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 8 }}>Check your inbox</h2>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.6, margin: 0 }}>We sent a reset link to<br /><strong style={{ color: T.text }}>{email}</strong></p>
            </div>
            <Btn onClick={() => navigate('login', {}, 'back')} variant="secondary">Back to sign in</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
