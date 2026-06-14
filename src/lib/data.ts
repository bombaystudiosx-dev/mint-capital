// Data layer & localStorage persistence — ported from bank-data.js.
// Fixes vs. prototype: the original referenced an undefined `DEMO` global in
// Auth.getUser/Auth.register (a leftover from a removed demo account). Those
// references are removed here so registration works.

import type { Card, Tx, Recipient, Notif, User } from '../types';

export const KEYS = {
  USER: 'mintcap_user',
  BALANCE: 'mintcap_balance',
  TRANSACTIONS: 'mintcap_txs',
  RECIPIENTS: 'mintcap_rcpts',
  CARDS: 'mintcap_cards',
  NOTIFS: 'mintcap_notifs',
  AUTHED: 'mintcap_authed',
  ONBOARDED: 'mintcap_onboarded',
  USERS: 'mintcap_users',
} as const;

export const DEFAULT_CARDS: Card[] = [
  { id: 'c1', name: 'Mint Platinum', full: '4719 •••• •••• 4832', expiry: '09/28', type: 'visa', bg: ['#0A2419', '#10B981'], balance: 24850.0, frozen: false },
  { id: 'c2', name: 'Mint Savings', full: '5432 •••• •••• 7291', expiry: '03/27', type: 'mc', bg: ['#1A3A2E', '#059669'], balance: 8320.5, frozen: false },
  { id: 'c3', name: 'Mint Business', full: '3782 •••• •••• 1056', expiry: '11/26', type: 'visa', bg: ['#064E3B', '#047857'], balance: 15200.0, frozen: false },
];

export const DEFAULT_TXS: Tx[] = [
  { id: 't1', type: 'debit', name: 'Netflix', category: 'Entertainment', amount: -15.99, date: '2026-06-10', icon: 'entertainment' },
  { id: 't2', type: 'credit', name: 'Salary — June', category: 'Income', amount: 5200.0, date: '2026-06-09', icon: 'income' },
  { id: 't3', type: 'debit', name: 'Whole Foods', category: 'Groceries', amount: -84.5, date: '2026-06-08', icon: 'shopping' },
  { id: 't4', type: 'debit', name: 'Uber', category: 'Transport', amount: -22.0, date: '2026-06-07', icon: 'transport' },
  { id: 't5', type: 'credit', name: 'Freelance — May', category: 'Income', amount: 1200.0, date: '2026-06-06', icon: 'income' },
  { id: 't6', type: 'debit', name: 'Apple Store', category: 'Shopping', amount: -299.0, date: '2026-06-05', icon: 'shopping' },
  { id: 't7', type: 'debit', name: 'Spotify', category: 'Entertainment', amount: -9.99, date: '2026-06-04', icon: 'entertainment' },
  { id: 't8', type: 'debit', name: 'Coffee House', category: 'Food & Drink', amount: -6.5, date: '2026-06-03', icon: 'food' },
  { id: 't9', type: 'debit', name: 'Electric Bill', category: 'Utilities', amount: -94.2, date: '2026-06-02', icon: 'utilities' },
  { id: 't10', type: 'credit', name: 'Refund — Zara', category: 'Shopping', amount: 45.0, date: '2026-06-01', icon: 'shopping' },
];

export const DEFAULT_RCPTS: Recipient[] = [
  { id: 'r1', name: 'Alex Johnson', email: 'alex.j@email.com', initials: 'AJ', color: '#6B4FF4' },
  { id: 'r2', name: 'Sarah Miller', email: 'sarah.m@email.com', initials: 'SM', color: '#06D6A0' },
  { id: 'r3', name: 'Mike Chen', email: 'mike.c@email.com', initials: 'MC', color: '#FF6B6B' },
  { id: 'r4', name: 'Emma Davis', email: 'emma.d@email.com', initials: 'ED', color: '#FFB347' },
  { id: 'r5', name: 'James Wilson', email: 'james.w@email.com', initials: 'JW', color: '#4CC9F0' },
];

export const DEFAULT_NOTIFS: Notif[] = [
  { id: 'n1', type: 'credit', title: 'Money received', body: 'You received $1,200.00 from Freelance — May', time: '2h ago', read: false },
  { id: 'n2', type: 'debit', title: 'Payment sent', body: 'Transfer of $299.00 to Apple Store completed', time: '1d ago', read: false },
  { id: 'n3', type: 'info', title: 'Security alert', body: 'New login detected from Chrome on MacOS', time: '2d ago', read: true },
  { id: 'n4', type: 'promo', title: 'Cashback earned', body: 'You earned $24.50 cashback this month. Keep it up!', time: '3d ago', read: true },
  { id: 'n5', type: 'info', title: 'Statement ready', body: 'Your May 2026 statement is ready to view', time: '5d ago', read: true },
];

// ── Storage helpers ───────────────────────────────────────────
interface DBApi {
  get<T>(k: string, fb: T): T;
  get<T>(k: string): T | null;
  set(k: string, v: unknown): void;
  del(k: string): void;
}

export const DB: DBApi = {
  get<T>(k: string, fb: T | null = null): T | null {
    try {
      const v = localStorage.getItem(k);
      return v != null ? (JSON.parse(v) as T) : fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: unknown): void {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* ignore quota / serialization errors */
    }
  },
  del(k: string): void {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  },
};

export function initData(): void {
  if (!DB.get<Card[]>(KEYS.CARDS)) DB.set(KEYS.CARDS, []);
  if (!DB.get<Tx[]>(KEYS.TRANSACTIONS)) DB.set(KEYS.TRANSACTIONS, []);
  if (!DB.get<Recipient[]>(KEYS.RECIPIENTS)) DB.set(KEYS.RECIPIENTS, []);
  if (!DB.get<Notif[]>(KEYS.NOTIFS)) DB.set(KEYS.NOTIFS, []);
  if (DB.get<number>(KEYS.BALANCE) == null) DB.set(KEYS.BALANCE, 0);
}

// ── Auth ─────────────────────────────────────────────────────
export interface AuthResult {
  ok: boolean;
  error?: string;
}

export const Auth = {
  isAuthed: (): boolean => !!DB.get<boolean>(KEYS.AUTHED),
  getUser: (): User | null => DB.get<User>(KEYS.USER),
  hasOnboarded: (): boolean => !!DB.get<boolean>(KEYS.ONBOARDED),
  setOnboarded: (): void => DB.set(KEYS.ONBOARDED, true),

  login: (email: string, password: string): AuthResult => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    const u = users.find((u) => u.email.trim() === email.trim() && u.password === password);
    if (u) {
      DB.set(KEYS.AUTHED, true);
      DB.set(KEYS.USER, u);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid email or password' };
  },

  register: (data: { name: string; email: string; phone: string; password: string }): AuthResult => {
    const users = DB.get<User[]>(KEYS.USERS, []);
    if (users.find((u) => u.email.trim() === data.email.trim())) return { ok: false, error: 'Email already in use' };
    const u: User = { ...data, joined: new Date().toISOString().split('T')[0] };
    users.push(u);
    DB.set(KEYS.USERS, users);
    DB.set(KEYS.AUTHED, true);
    DB.set(KEYS.USER, u);
    initData();
    return { ok: true };
  },

  logout: (): void => DB.del(KEYS.AUTHED),
};

// ── Bank API ─────────────────────────────────────────────────
export const BankAPI = {
  getBalance: (): number => DB.get<number>(KEYS.BALANCE, 0),
  getCards: (): Card[] => DB.get<Card[]>(KEYS.CARDS, []),
  getTransactions: (): Tx[] => DB.get<Tx[]>(KEYS.TRANSACTIONS, []),
  getRecipients: (): Recipient[] => DB.get<Recipient[]>(KEYS.RECIPIENTS, []),
  getNotifications: (): Notif[] => DB.get<Notif[]>(KEYS.NOTIFS, []),
  getUnread: (): number => DB.get<Notif[]>(KEYS.NOTIFS, []).filter((n) => !n.read).length,

  sendMoney: (recipient: Recipient, amount: number, note = ''): Tx => {
    const currentUser = Auth.getUser();
    const users = DB.get<User[]>(KEYS.USERS, []);
    const recipientUser = users.find((u) => u.email.trim().toLowerCase() === recipient.email.trim().toLowerCase());

    const tx: Tx = {
      id: 'tx' + Date.now(),
      type: 'debit',
      name: 'Transfer to ' + recipient.name,
      category: 'Transfer',
      amount: -amount,
      date: new Date().toISOString().split('T')[0],
      icon: 'transfer',
      note,
    };

    const txs = BankAPI.getTransactions();
    txs.unshift(tx);
    DB.set(KEYS.TRANSACTIONS, txs);
    const bal = BankAPI.getBalance() - amount;
    DB.set(KEYS.BALANCE, bal);
    const cards = BankAPI.getCards();
    if (cards[0]) {
      cards[0].balance = bal;
      DB.set(KEYS.CARDS, cards);
    }

    if (recipientUser) {
      const incomeTx: Tx = {
        id: 'tx' + Date.now() + 'in',
        type: 'credit',
        name: 'Transfer from ' + (currentUser?.name || 'Unknown'),
        category: 'Transfer',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        icon: 'transfer',
        note: note || undefined,
      };

      const recipientBalance = DB.get<number>('mintcap_balance_' + recipientUser.email.replace(/[^a-z0-9]/gi, '').toLowerCase(), 0);
      DB.set('mintcap_balance_' + recipientUser.email.replace(/[^a-z0-9]/gi, '').toLowerCase(), recipientBalance + amount);

      const recipientTxs = DB.get<Tx[]>('mintcap_txs_' + recipientUser.email.replace(/[^a-z0-9]/gi, '').toLowerCase(), []);
      recipientTxs.unshift(incomeTx);
      DB.set('mintcap_txs_' + recipientUser.email.replace(/[^a-z0-9]/gi, '').toLowerCase(), recipientTxs);

      const recipientNotifs = DB.get<Notif[]>('mintcap_notifs_' + recipientUser.email.replace(/[^a-z0-9]/gi, '').toLowerCase(), []);
      const notif: Notif = {
        id: 'n' + Date.now(),
        type: 'credit',
        title: 'Money received',
        body: `You received ${F.money(amount)} from ${currentUser?.name || 'Someone'}`,
        time: 'now',
        read: false,
      };
      recipientNotifs.unshift(notif);
      DB.set('mintcap_notifs_' + recipientUser.email.replace(/[^a-z0-9]/gi, '').toLowerCase(), recipientNotifs);
    }

    return tx;
  },

  addRecipient: (r: { name: string; email: string }): Recipient => {
    const rs = BankAPI.getRecipients();
    const colors = ['#6B4FF4', '#06D6A0', '#FF6B6B', '#FFB347', '#4CC9F0', '#F72585'];
    const newR: Recipient = {
      ...r,
      id: 'r' + Date.now(),
      initials: r.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      color: colors[rs.length % colors.length],
    };
    rs.push(newR);
    DB.set(KEYS.RECIPIENTS, rs);
    return newR;
  },

  toggleFreezeCard: (cardId: string): Card[] => {
    const cards = BankAPI.getCards();
    const idx = cards.findIndex((c) => c.id === cardId);
    if (idx >= 0) {
      cards[idx].frozen = !cards[idx].frozen;
      DB.set(KEYS.CARDS, cards);
    }
    return BankAPI.getCards();
  },

  markAllRead: (): void => {
    const ns = BankAPI.getNotifications().map((n) => ({ ...n, read: true }));
    DB.set(KEYS.NOTIFS, ns);
  },
};

// ── Helper functions ──────────────────────────────────────────
export function isUserOnPlatform(email: string): boolean {
  const users = DB.get<User[]>(KEYS.USERS, []);
  return users.some((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
}

export function getUserByEmail(email: string): User | null {
  const users = DB.get<User[]>(KEYS.USERS, []);
  return users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()) || null;
}

// ── Validation ────────────────────────────────────────────────
export const V = {
  email: (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone: (v: string): boolean => /^[\d\s\-+()]{7,15}$/.test(v.trim()),
  password: (v: string): boolean => v.length >= 8,
  name: (v: string): boolean => v.trim().length >= 2,
  notEmpty: (v: string): boolean => v.trim().length > 0,
  strength: (v: string): number => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  },
};

// ── Formatters ────────────────────────────────────────────────
export const F = {
  money: (n: number): string => {
    const a = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (n < 0 ? '-' : '') + '$' + a;
  },
  date: (d: string): string => {
    const dt = new Date(d + 'T12:00:00');
    const td = new Date();
    const yd = new Date(td);
    yd.setDate(yd.getDate() - 1);
    if (d === td.toISOString().split('T')[0]) return 'Today';
    if (d === yd.toISOString().split('T')[0]) return 'Yesterday';
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },
  initials: (n: string): string =>
    n
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
  greeting: (): string => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  },
};
