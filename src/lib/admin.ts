// Admin data layer & controls — ported from bank-admin.js.
// Fix vs. prototype: the original context-switching read/wrote `vault_*`
// localStorage keys while the data layer uses `mintcap_*`, so admin edits never
// reached customer data. Here we use the shared KEYS constants so admin actions
// (add balance, approve/reject KYC) actually affect the demo dataset.

import { DB, KEYS, BankAPI } from './data';
import { KYC } from './kyc';
import type { User, AdminRecord, AdminSession, Tx, Card, KYCStatus, KYCData } from '../types';

const ADMIN_KEYS = {
  ADMINS: 'mintcap_admins',
  AUTH: 'mintcap_admin_auth',
} as const;

export const ADMIN_EMAIL = 'admin@mintcapital.app';
export const ADMIN_PASSWORD = 'MintAdmin123!';

export function initAdmin(): void {
  const admins = DB.get<AdminRecord[]>(ADMIN_KEYS.ADMINS, []);
  if (!admins.find((a) => a.email === ADMIN_EMAIL)) {
    admins.push({
      id: 'adm_' + Date.now(),
      name: 'Mint Capital Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    });
    DB.set(ADMIN_KEYS.ADMINS, admins);
  }
}

interface AdminResult {
  ok: boolean;
  error?: string;
  newBalance?: number;
  transaction?: Tx;
  admin?: AdminRecord;
}

export interface AdminUserSummary extends User {
  kycStatus: KYCStatus;
  balance: number;
  txCount: number;
}

export interface AdminUserDetails extends User {
  balance: number;
  cards: Card[];
  transactions: Tx[];
  kycStatus: KYCStatus;
  kycData: KYCData;
}

// Temporarily set the "active user" context, run a read, then restore it.
function withUserContext<R>(user: User, fn: () => R): R {
  const savedAuth = DB.get<boolean>(KEYS.AUTHED);
  const savedUser = DB.get<User>(KEYS.USER);
  DB.set(KEYS.AUTHED, true);
  DB.set(KEYS.USER, user);
  try {
    return fn();
  } finally {
    if (savedAuth) DB.set(KEYS.AUTHED, savedAuth);
    if (savedUser) DB.set(KEYS.USER, savedUser);
  }
}

export const Admin = {
  login: (email: string, password: string): AdminResult => {
    const admins = DB.get<AdminRecord[]>(ADMIN_KEYS.ADMINS, []);
    const a = admins.find((adm) => adm.email.trim() === email.trim() && adm.password === password);
    if (a) {
      const session: AdminSession = { id: a.id, email: a.email, role: a.role, name: a.name };
      DB.set(ADMIN_KEYS.AUTH, session);
      return { ok: true, admin: a };
    }
    return { ok: false, error: 'Invalid admin credentials' };
  },

  isLoggedIn: (): boolean => !!DB.get<AdminSession>(ADMIN_KEYS.AUTH),
  getAdmin: (): AdminSession | null => DB.get<AdminSession>(ADMIN_KEYS.AUTH),
  logout: (): void => DB.del(ADMIN_KEYS.AUTH),

  getAllUsers: (): AdminUserSummary[] => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    return users.map((u) => ({
      ...u,
      kycStatus: KYC.getStatus(),
      balance: BankAPI.getBalance(),
      txCount: BankAPI.getTransactions().length,
    }));
  },

  findUser: (email: string): User | undefined => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    return users.find((u) => u.email.trim() === email.trim());
  },

  getUserDetails: (email: string): AdminUserDetails | null => {
    const user = Admin.findUser(email);
    if (!user) return null;
    return withUserContext(user, () => ({
      ...user,
      balance: BankAPI.getBalance(),
      cards: BankAPI.getCards(),
      transactions: BankAPI.getTransactions(),
      kycStatus: KYC.getStatus(),
      kycData: KYC.getData(),
    }));
  },

  addBalance: (email: string, amount: number): AdminResult => {
    const user = Admin.findUser(email);
    if (!user) return { ok: false, error: 'User not found' };
    return withUserContext(user, () => {
      const currentBalance = BankAPI.getBalance();
      const newBalance = currentBalance + amount;
      DB.set(KEYS.BALANCE, newBalance);

      const cards = BankAPI.getCards();
      if (cards[0]) {
        cards[0].balance = newBalance;
        DB.set(KEYS.CARDS, cards);
      }

      const adminTx: Tx = {
        id: 'admin_tx_' + Date.now(),
        type: 'credit',
        name: 'Admin Deposit',
        category: 'Admin',
        amount,
        date: new Date().toISOString().split('T')[0],
        icon: 'income',
        note: `Admin added ${amount} to account`,
        admin: true,
      };
      const txs = BankAPI.getTransactions();
      txs.unshift(adminTx);
      DB.set(KEYS.TRANSACTIONS, txs);

      return { ok: true, newBalance, transaction: adminTx };
    });
  },

  approveKYC: (email: string): AdminResult => {
    const user = Admin.findUser(email);
    if (!user) return { ok: false, error: 'User not found' };
    return withUserContext(user, () => {
      KYC.completeKYC();
      return { ok: true };
    });
  },

  rejectKYC: (email: string, reason: string): AdminResult => {
    const user = Admin.findUser(email);
    if (!user) return { ok: false, error: 'User not found' };
    return withUserContext(user, () => {
      const status = KYC.getStatus();
      status.approved = false;
      status.verified = false;
      status.rejectionReason = reason;
      KYC.setStatus(status);
      return { ok: true };
    });
  },

  freezeAccount: (email: string): AdminResult => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    const idx = users.findIndex((u) => u.email.trim() === email.trim());
    if (idx < 0) return { ok: false, error: 'User not found' };
    users[idx].frozen = true;
    users[idx].frozenAt = new Date().toISOString();
    DB.set(KEYS.USERS, users);
    return { ok: true };
  },

  unfreezeAccount: (email: string): AdminResult => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    const idx = users.findIndex((u) => u.email.trim() === email.trim());
    if (idx < 0) return { ok: false, error: 'User not found' };
    users[idx].frozen = false;
    DB.set(KEYS.USERS, users);
    return { ok: true };
  },

  deleteUser: (email: string): AdminResult => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    const filtered = users.filter((u) => u.email.trim() !== email.trim());
    if (filtered.length === users.length) return { ok: false, error: 'User not found' };
    DB.set(KEYS.USERS, filtered);
    return { ok: true };
  },
};
