// KYC onboarding screens — ported from bank-kyc-screens.jsx.

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { T } from '../theme';
import { V } from '../lib/data';
import { KYC } from '../lib/kyc';
import { Icon } from '../components/Icon';
import { Btn, InputField, PageHeader } from '../components/ui';
import type { KYCData, ScreenProps } from '../types';

// ── KYC Welcome ───────────────────────────────────────────────
export function KYCWelcomeScreen({ navigate }: ScreenProps) {
  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', paddingTop: 62, overflowY: 'auto' }}>
      <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <PageHeader title="Verify your identity" onBack={() => navigate('home', {}, 'back')} bg={T.bg} />
          <div style={{ marginTop: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Icon name="shield" size={40} color={T.accent} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text, margin: '0 0 12px', letterSpacing: -0.5 }}>Identity Verification</h2>
            <p style={{ fontSize: 15, color: T.muted, margin: '0 0 28px', lineHeight: 1.6 }}>Complete verification in 3 minutes. We need to confirm your identity and address to unlock full banking features.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { icon: 'check', label: 'Personal Information', time: '~1 min' },
                { icon: 'check', label: 'Address Verification', time: '~1 min' },
                { icon: 'check', label: 'Document Upload', time: '~1 min' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, background: T.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={step.icon} size={16} color={T.success} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={() => navigate('kycPersonal', {}, 'forward')}>Start Verification</Btn>
          <Btn onClick={() => navigate('home', {}, 'back')} variant="ghost">Skip for now</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Personal Information ──────────────────────────────────────
export function KYCPersonalScreen({ navigate }: ScreenProps) {
  const [f, setF] = useState<KYCData>(KYC.getData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof KYCData, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!V.name(f.firstName)) e.firstName = 'First name required';
    if (!V.name(f.lastName)) e.lastName = 'Last name required';
    if (!f.dob) e.dob = 'Date of birth required';
    if (!f.ssn || f.ssn.length < 9) e.ssn = 'Valid SSN required';
    return e;
  };

  const proceed = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    KYC.setData(f);
    KYC.nextStep();
    navigate('kycAddress', {}, 'forward');
  };

  const age = f.dob ? Math.floor((Date.now() - new Date(f.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 0, overflowY: 'auto' }}>
      <div style={{ padding: '0 0 20px' }}>
        <PageHeader title="Personal Information" onBack={() => navigate('kycWelcome', {}, 'back')} bg={T.surface} right={<div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Step 1 of 3</div>} />
        <div style={{ padding: '16px 24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: T.muted }}>We need your legal name and date of birth to verify your identity.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <InputField label="First Name" value={f.firstName} onChange={(v) => set('firstName', v)} placeholder="John" error={errors.firstName} />
              </div>
              <div style={{ flex: 1 }}>
                <InputField label="Last Name" value={f.lastName} onChange={(v) => set('lastName', v)} placeholder="Doe" error={errors.lastName} />
              </div>
            </div>
            <InputField label="Date of Birth" value={f.dob} onChange={(v) => set('dob', v)} type="date" error={errors.dob} />
            {age !== null && <p style={{ margin: 0, fontSize: 13, color: age >= 18 ? T.success : T.error }}>{age} years old {age < 18 ? '(Must be 18+)' : ''}</p>}
            <InputField label="Social Security Number" value={f.ssn} onChange={(v) => set('ssn', v.replace(/\D/g, '').slice(0, 9))} placeholder="XXX-XX-XXXX" prefix="🔒" error={errors.ssn} hint="Used only for verification" />
          </div>
          <div style={{ background: T.accentLight, borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Icon name="info" size={16} color={T.accent} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: T.accentMid, lineHeight: 1.5 }}>Your data is encrypted and only used for identity verification.</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={proceed} fullWidth>Continue</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Address Verification ──────────────────────────────────────
export function KYCAddressScreen({ navigate }: ScreenProps) {
  const [f, setF] = useState<KYCData>(KYC.getData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof KYCData, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!V.notEmpty(f.street)) e.street = 'Street address required';
    if (!V.notEmpty(f.city)) e.city = 'City required';
    if (!V.notEmpty(f.state)) e.state = 'State required';
    if (!V.notEmpty(f.zip) || !/^\d{5}(-\d{4})?$/.test(f.zip.trim())) e.zip = 'Valid ZIP code required';
    return e;
  };

  const proceed = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    KYC.setData(f);
    KYC.nextStep();
    navigate('kycEmployment', {}, 'forward');
  };

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 0, overflowY: 'auto' }}>
      <div style={{ padding: '0 0 20px' }}>
        <PageHeader title="Address" onBack={() => { KYC.prevStep(); navigate('kycPersonal', {}, 'back'); }} bg={T.surface} right={<div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Step 2 of 3</div>} />
        <div style={{ padding: '16px 24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: T.muted }}>Verify your current residential address.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <InputField label="Street Address" value={f.street} onChange={(v) => set('street', v)} placeholder="123 Main Street" error={errors.street} />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 2 }}>
                <InputField label="City" value={f.city} onChange={(v) => set('city', v)} placeholder="San Francisco" error={errors.city} />
              </div>
              <div style={{ flex: 1 }}>
                <InputField label="State" value={f.state} onChange={(v) => set('state', v.toUpperCase().slice(0, 2))} placeholder="CA" error={errors.state} />
              </div>
            </div>
            <InputField label="ZIP Code" value={f.zip} onChange={(v) => set('zip', v)} placeholder="94102" error={errors.zip} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={proceed} fullWidth>Continue</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Employment Information ────────────────────────────────────
export function KYCEmploymentScreen({ navigate }: ScreenProps) {
  const [f, setF] = useState<KYCData>(KYC.getData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof KYCData, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!V.notEmpty(f.jobTitle)) e.jobTitle = 'Job title required';
    if (!V.notEmpty(f.employer)) e.employer = 'Employer required';
    if (!V.notEmpty(f.industry)) e.industry = 'Industry required';
    return e;
  };

  const proceed = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    KYC.setData(f);
    KYC.nextStep();
    navigate('kycDocument', {}, 'forward');
  };

  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Government', 'Other'];

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 0, overflowY: 'auto' }}>
      <div style={{ padding: '0 0 20px' }}>
        <PageHeader title="Employment" onBack={() => { KYC.prevStep(); navigate('kycAddress', {}, 'back'); }} bg={T.surface} right={<div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Step 3 of 3</div>} />
        <div style={{ padding: '16px 24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: T.muted }}>Help us understand your employment background.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <InputField label="Job Title" value={f.jobTitle} onChange={(v) => set('jobTitle', v)} placeholder="Software Engineer" error={errors.jobTitle} />
            <InputField label="Employer" value={f.employer} onChange={(v) => set('employer', v)} placeholder="Tech Company Inc." error={errors.employer} />
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.muted, display: 'block', marginBottom: 6 }}>Industry</label>
              <select
                value={f.industry}
                onChange={(e) => set('industry', e.target.value)}
                style={{
                  width: '100%',
                  height: 56,
                  padding: '0 16px',
                  borderRadius: 14,
                  border: `1.5px solid ${T.border}`,
                  background: T.surface,
                  color: T.text,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 15,
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='${T.muted.replace('#', '%23')}' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  paddingRight: 40,
                }}
              >
                <option value="">Select industry...</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              {errors.industry && <p style={{ margin: '4px 0 0', fontSize: 13, color: T.error }}>{errors.industry}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={proceed} fullWidth>Continue to ID Upload</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Document Upload ───────────────────────────────────────────
export function KYCDocumentScreen({ navigate }: ScreenProps) {
  const [docType, setDocType] = useState('passport');
  const [docNum, setDocNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, [side]: 'File too large (max 5MB)' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result as string;
      if (side === 'front') {
        setFrontFile(file);
        setFrontPreview(data);
      } else {
        setBackFile(file);
        setBackPreview(data);
      }
      setErrors((p) => ({ ...p, [side]: '' }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!V.notEmpty(docNum)) e.docNum = 'Document number required';
    if (!V.notEmpty(expiry)) e.expiry = 'Expiration date required';
    if (!frontFile) e.front = 'Front side photo required';
    if (docType !== 'passport' && !backFile) e.back = 'Back side photo required';
    return e;
  };

  const proceed = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    KYC.submitDocument(docType, docNum, expiry, frontPreview, backPreview);
    KYC.nextStep();
    navigate('kycReview', {}, 'forward');
  };

  const docTypes: Record<string, string> = { passport: 'Passport', driversLicense: "Driver's License", nationalId: 'National ID', visa: 'Visa' };

  return (
    <div style={{ height: '100%', background: T.surface, display: 'flex', flexDirection: 'column', paddingTop: 0, overflowY: 'auto' }}>
      <div style={{ padding: '0 0 20px' }}>
        <PageHeader title="Upload ID" onBack={() => { KYC.prevStep(); navigate('kycEmployment', {}, 'back'); }} bg={T.surface} right={<div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Step 4 of 4</div>} />
        <div style={{ padding: '16px 24px' }}>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: T.muted }}>Upload a clear photo of both sides of your ID.</p>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: T.muted, display: 'block', marginBottom: 8 }}>Document Type</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(docTypes).map(([key, label]) => (
                <button key={key} onClick={() => setDocType(key)} style={{ padding: '8px 16px', borderRadius: 10, border: docType === key ? '2px solid ' + T.accent : '1.5px solid ' + T.border, background: docType === key ? T.accentLight : 'transparent', color: T.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <InputField label="Document Number" value={docNum} onChange={setDocNum} placeholder="A12345678" error={errors.docNum} />
            </div>
            <div style={{ flex: 1 }}>
              <InputField label="Expiry Date" value={expiry} onChange={setExpiry} type="date" error={errors.expiry} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: T.muted, display: 'block', marginBottom: 8 }}>Front Side</label>
            {frontPreview ? (
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
                <img src={frontPreview} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                <button onClick={() => { setFrontFile(null); setFrontPreview(null); }} style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}>
                  <Icon name="x" size={16} color="#fff" />
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '32px 16px', borderRadius: 14, border: `2px dashed ${T.border}`, cursor: 'pointer', background: T.bg, transition: 'border 0.2s', marginBottom: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <Icon name="card" size={24} color={T.muted} style={{ margin: '0 auto 8px' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.muted }}>Click to upload</span>
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'front')} style={{ display: 'none' }} />
              </label>
            )}
            {errors.front && <p style={{ margin: 0, fontSize: 13, color: T.error }}>{errors.front}</p>}
          </div>

          {docType !== 'passport' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.muted, display: 'block', marginBottom: 8 }}>Back Side</label>
              {backPreview ? (
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
                  <img src={backPreview} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <button onClick={() => { setBackFile(null); setBackPreview(null); }} style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="x" size={16} color="#fff" />
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '32px 16px', borderRadius: 14, border: `2px dashed ${T.border}`, cursor: 'pointer', background: T.bg, marginBottom: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <Icon name="card" size={24} color={T.muted} style={{ margin: '0 auto 8px' }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: T.muted }}>Click to upload</span>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'back')} style={{ display: 'none' }} />
                </label>
              )}
              {errors.back && <p style={{ margin: 0, fontSize: 13, color: T.error }}>{errors.back}</p>}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={proceed} fullWidth>Review & Submit</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Review & Submission ───────────────────────────────────────
export function KYCReviewScreen({ navigate }: ScreenProps) {
  const [loading, setLoading] = useState(false);
  const kycData = KYC.getData();

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      KYC.completeKYC();
      setLoading(false);
      navigate('kycApproved', {}, 'forward');
    }, 2000);
  };

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', paddingTop: 62, overflowY: 'auto' }}>
      <div style={{ padding: '16px 24px 28px' }}>
        <PageHeader title="Review Information" onBack={() => { KYC.prevStep(); navigate('kycDocument', {}, 'back'); }} bg={T.bg} />
        <p style={{ margin: '0 0 20px', fontSize: 14, color: T.muted }}>Please verify your information is correct.</p>

        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>Personal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><span style={{ fontSize: 12, color: T.muted }}>Name</span><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{kycData.firstName} {kycData.lastName}</p></div>
            <div><span style={{ fontSize: 12, color: T.muted }}>DOB</span><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{kycData.dob}</p></div>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>Address</h3>
          <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.6 }}>
            {kycData.street}<br />
            {kycData.city}, {kycData.state} {kycData.zip}
          </p>
        </div>

        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>Employment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><span style={{ fontSize: 12, color: T.muted }}>Title</span><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{kycData.jobTitle}</p></div>
            <div><span style={{ fontSize: 12, color: T.muted }}>Employer</span><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{kycData.employer}</p></div>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 20, padding: '16px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: T.text }}>ID Document</h3>
          {kycData.documentFront && (
            <div style={{ marginBottom: 12 }}>
              <img src={kycData.documentFront} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><span style={{ fontSize: 12, color: T.muted }}>Number</span><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{kycData.documentNumber}</p></div>
            <div><span style={{ fontSize: 12, color: T.muted }}>Expires</span><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: T.text }}>{kycData.documentExpiry}</p></div>
          </div>
        </div>

        <div style={{ background: T.accentLight, borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 8 }}>
          <Icon name="info" size={16} color={T.accent} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: T.accentMid }}>Your information will be verified securely. Approval typically takes 1-2 minutes.</span>
        </div>

        <Btn onClick={submit} loading={loading} fullWidth>Submit for Verification</Btn>
      </div>
    </div>
  );
}

// ── Verification Approved ─────────────────────────────────────
export function KYCApprovedScreen({ navigate }: ScreenProps) {
  const kycStatus = KYC.getStatus();

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px 80px' }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: T.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, animation: 'popIn 0.5s ease-out', boxShadow: `0 12px 30px ${T.success}44` }}>
        <Icon name="check" size={48} color={T.success} />
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.5, margin: '0 0 8px', textAlign: 'center' }}>Verified!</h2>
      <p style={{ fontSize: 16, color: T.muted, textAlign: 'center', lineHeight: 1.6, margin: '0 0 32px' }}>Your identity has been successfully verified. Your Vault account is now fully activated.</p>
      <div style={{ background: T.surface, borderRadius: 14, padding: '16px 20px', marginBottom: 32, border: `1px solid ${T.border}`, width: '100%', maxWidth: 280 }}>
        <p style={{ margin: 0, fontSize: 12, color: T.faint, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>Verification ID</p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text, fontFamily: 'monospace' }}>{kycStatus.verificationId}</p>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn onClick={() => navigate('home', {}, 'none')} variant="primary">Go to Dashboard</Btn>
        <Btn onClick={() => navigate('profile', {}, 'none')} variant="ghost">View Profile</Btn>
      </div>
    </div>
  );
}
