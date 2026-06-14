// KYC data layer & document handling — ported from bank-kyc.js.

import { DB } from './data';
import type { KYCData, KYCStatus } from '../types';

export const KYC_STEPS = ['personal', 'address', 'employment', 'document', 'review'] as const;

export const KYC_KEYS = {
  KYC_STATUS: 'vault_kyc_status',
  KYC_DATA: 'vault_kyc_data',
} as const;

const DEFAULT_STATUS: KYCStatus = { step: 0, completed: false, approved: false, verified: false, verificationId: null };

const DEFAULT_KYC_DATA: KYCData = {
  firstName: '',
  lastName: '',
  dob: '',
  ssn: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'USA',
  jobTitle: '',
  employer: '',
  industry: '',
  documentType: '',
  documentNumber: '',
  documentExpiry: '',
  documentFront: null,
  documentBack: null,
};

export function initKYC(): void {
  if (!DB.get<KYCStatus>(KYC_KEYS.KYC_STATUS)) {
    DB.set(KYC_KEYS.KYC_STATUS, { ...DEFAULT_STATUS });
  }
  if (!DB.get<KYCData>(KYC_KEYS.KYC_DATA)) {
    DB.set(KYC_KEYS.KYC_DATA, { ...DEFAULT_KYC_DATA });
  }
}

export const KYC = {
  getStatus: (): KYCStatus => DB.get<KYCStatus>(KYC_KEYS.KYC_STATUS, { ...DEFAULT_STATUS }),
  setStatus: (s: KYCStatus): void => DB.set(KYC_KEYS.KYC_STATUS, s),
  getData: (): KYCData => DB.get<KYCData>(KYC_KEYS.KYC_DATA, { ...DEFAULT_KYC_DATA }),
  setData: (d: Partial<KYCData>): void => DB.set(KYC_KEYS.KYC_DATA, { ...KYC.getData(), ...d }),
  isVerified: (): boolean => KYC.getStatus().approved === true,
  nextStep: (): void => {
    const s = KYC.getStatus();
    if (s.step < KYC_STEPS.length - 1) {
      s.step += 1;
      KYC.setStatus(s);
    }
  },
  prevStep: (): void => {
    const s = KYC.getStatus();
    if (s.step > 0) {
      s.step -= 1;
      KYC.setStatus(s);
    }
  },
  completeKYC: (): void => {
    const s = KYC.getStatus();
    s.completed = true;
    s.verified = true;
    s.approved = true;
    s.verificationId = 'VER-' + Math.random().toString(36).slice(2, 11).toUpperCase();
    KYC.setStatus(s);
  },
  submitDocument: (type: string, num: string, expiry: string, frontData: string | null, backData: string | null): void => {
    KYC.setData({
      documentType: type,
      documentNumber: num,
      documentExpiry: expiry,
      documentFront: frontData,
      documentBack: backData,
    });
  },
};
