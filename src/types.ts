// Shared data-model types for the Mint Capital app.

export type CardNetwork = 'visa' | 'mc';

export interface Card {
  id: string;
  name: string;
  full: string;
  expiry: string;
  type: CardNetwork;
  bg: [string, string];
  balance: number;
  frozen: boolean;
}

export type TxType = 'debit' | 'credit';

export interface Tx {
  id: string;
  type: TxType;
  name: string;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  icon: string;
  note?: string;
  admin?: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
}

export type NotifType = 'credit' | 'debit' | 'info' | 'promo';

export interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  password: string;
  joined?: string;
  frozen?: boolean;
  frozenAt?: string;
}

export interface KYCData {
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  jobTitle: string;
  employer: string;
  industry: string;
  documentType: string;
  documentNumber: string;
  documentExpiry: string;
  documentFront: string | null;
  documentBack: string | null;
}

export interface KYCStatus {
  step: number;
  completed: boolean;
  approved: boolean;
  verified: boolean;
  verificationId: string | null;
  rejectionReason?: string;
}

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  email: string;
  role: string;
  name: string;
}

// Navigation contract shared by every screen.
export type NavDirection = 'forward' | 'back' | 'none';

export interface ScreenProps {
  navigate: (screen: string, params?: Record<string, unknown>, dir?: NavDirection) => void;
  goBack: () => void;
  [key: string]: unknown;
}
