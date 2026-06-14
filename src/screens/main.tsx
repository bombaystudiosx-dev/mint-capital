// Main screens — Home, Wallet, Transactions, Notifications.
// Ported from bank-main-screens.jsx.

import { useEffect, useState } from 'react';
import { T } from '../theme';
import { Auth, BankAPI, F } from '../lib/data';
import { Icon } from '../components/Icon';
import { SectionHeader, Spinner, TxItem, BalanceCard, Btn } from '../components/ui';
import type { Card, Tx, Notif, ScreenProps } from '../types';

// ── Home ──────────────────────────────────────────────────────
interface HomeData {
  user: ReturnType<typeof Auth.getUser>;
  balance: number;
  cards: Card[];
  txs: Tx[];
  unread: number;
}

export function HomeScreen({ navigate }: ScreenProps) {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    setData({
      user: Auth.getUser(),
      balance: BankAPI.getBalance(),
      cards: BankAPI.getCards(),
      txs: BankAPI.getTransactions().slice(0, 4),
      unread: BankAPI.getUnread(),
    });
  }, []);

  if (!data) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>;

  const { user, balance, cards, txs, unread } = data;
  const card = cards[0];
  const firstName = (user?.name || '').split(' ')[0];

  const hasCard = cards.length > 0;

  const allTxs = BankAPI.getTransactions();
  const now = new Date();
  const monthTxs = allTxs.filter((t) => {
    const d = new Date(t.date + 'T12:00:00');
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.amount < 0;
  });
  const totalSpent = Math.abs(monthTxs.reduce((s, t) => s + t.amount, 0));
  const catTotals: Record<string, number> = {};
  monthTxs.forEach((t) => {
    catTotals[t.category] = (catTotals[t.category] || 0) + Math.abs(t.amount);
  });
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const quickActions = [
    { label: 'Send', icon: 'send', screen: 'transfer' },
    { label: 'Receive', icon: 'receive', screen: 'wallet' },
    { label: 'Pay', icon: 'pay', screen: 'transfer' },
    { label: 'Cards', icon: 'card', screen: 'wallet' },
  ];

  const catColorMap: Record<string, string> = {
    Entertainment: T.accent,
    Groceries: '#22C55E',
    Shopping: '#F59E0B',
    Transport: '#3B82F6',
    'Food & Drink': '#EC4899',
    Utilities: '#8B8BA0',
    Income: '#22C55E',
    Transfer: T.accent,
  };

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, color: T.muted, marginBottom: 3 }}>{F.greeting()},</p>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>{firstName} 👋</h2>
        </div>
        <button onClick={() => navigate('notifications', {}, 'forward')} style={{ position: 'relative', width: 44, height: 44, borderRadius: 14, background: T.surface, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', WebkitTapHighlightColor: 'transparent', marginTop: 4 }}>
          <Icon name="bell" size={22} color={T.text} />
          {unread > 0 && <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, background: T.error, border: `2px solid ${T.surface}` }} />}
        </button>
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 500, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>Total Balance</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: -1 }}>{F.money(balance)}</span>
          {balance > 0 && <span style={{ fontSize: 13, color: T.success, fontWeight: 600, background: T.successLight, padding: '2px 8px', borderRadius: 6 }}>+2.4%</span>}
        </div>
        {hasCard ? (
          <BalanceCard card={card!} onClick={() => navigate('wallet', {}, 'forward')} />
        ) : (
          <div style={{ background: T.surface, borderRadius: 24, padding: '40px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            <div style={{ marginBottom: 16 }}>
              <Icon name="card" size={40} color={T.accent} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: T.text }}>No cards yet</h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: T.muted }}>Add your first card to get started</p>
            <Btn variant="primary" size="sm" fullWidth onClick={() => navigate('wallet', {}, 'forward')}>Add Card</Btn>
          </div>
        )}
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.screen, {}, 'forward')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', padding: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'transform 0.1s' }}>
                <Icon name={a.icon} size={22} color={T.accent} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: '24px 24px 0', background: T.surface, borderRadius: 20, padding: '18px 18px 8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>This month</span>
          <span style={{ fontSize: 13, color: T.muted }}>{new Date().toLocaleString('en-US', { month: 'long' })}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: T.text }}>{F.money(totalSpent)}</span>
          <span style={{ fontSize: 13, color: T.muted }}>spent</span>
        </div>
        {topCats.length === 0 ? (
          <p style={{ fontSize: 14, color: T.faint, margin: '0 0 12px' }}>No spending recorded this month.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
            {topCats.map(([cat, amt]) => {
              const maxAmt = topCats[0][1];
              const pct = (amt / maxAmt) * 100;
              const col = catColorMap[cat] || T.accent;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{cat}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{F.money(amt)}</span>
                  </div>
                  <div style={{ height: 5, background: T.borderLight, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '24px 24px 0' }}>
        <SectionHeader title="Recent" action="See all" onAction={() => navigate('transactions', {}, 'forward')} />
        <div style={{ background: T.surface, borderRadius: 20, padding: '4px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          {txs.map((tx, i) => (
            <div key={tx.id}>
              <TxItem tx={tx} />
              {i < txs.length - 1 && <div style={{ height: 1, background: T.borderLight }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Wallet ────────────────────────────────────────────────────
export function WalletScreen({ navigate }: ScreenProps) {
  const [cards, setCards] = useState<Card[]>(BankAPI.getCards());
  const [selIdx, setSelIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const selCard = cards[selIdx];

  const recentTxs = BankAPI.getTransactions().slice(0, 5);

  const freeze = () => {
    if (!selCard) return;
    const updated = BankAPI.toggleFreezeCard(selCard.id);
    setCards(updated);
    setToast(updated[selIdx].frozen ? 'Card frozen' : 'Card unfrozen');
    setTimeout(() => setToast(null), 2500);
  };

  const cardActions = [
    { label: selCard?.frozen ? 'Unfreeze' : 'Freeze', icon: 'freeze', onClick: freeze },
    { label: 'Details', icon: 'card', onClick: () => {} },
    { label: 'Limits', icon: 'lock', onClick: () => {} },
    { label: 'Block', icon: 'x', onClick: () => {} },
  ];

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 78, left: '50%', transform: 'translateX(-50%)', background: T.cardDark, color: '#fff', borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 500, zIndex: 100, animation: 'fadeIn 0.2s ease-out', whiteSpace: 'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding: '20px 24px 0' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>My Cards</h2>
      </div>

      {cards.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <Icon name="card" size={48} color={T.accent} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: T.text, textAlign: 'center' }}>No cards added yet</h3>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: T.muted, textAlign: 'center', maxWidth: 280 }}>Add your first card to start managing your finances</p>
          <Btn variant="primary" onClick={() => {}}>Add Your First Card</Btn>
        </div>
      ) : (
        <>
          <div style={{ paddingTop: 20, paddingBottom: 8 }}>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
              {cards.map((card, i) => (
                <div key={card.id} onClick={() => setSelIdx(i)} style={{ scrollSnapAlign: 'start', transition: 'opacity 0.2s', opacity: selIdx === i ? 1 : 0.65 }}>
                  <BalanceCard card={card} />
                </div>
              ))}
              <div style={{ scrollSnapAlign: 'start', width: 338, height: 213, borderRadius: 24, border: `2px dashed ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0, cursor: 'pointer', background: T.surface }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="plus" size={22} color={T.accent} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: T.muted }}>Add new card</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', paddingTop: 14 }}>
              {cards.map((_, i) => (
                <div key={i} style={{ width: i === selIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === selIdx ? T.accent : T.border, transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => setSelIdx(i)} />
              ))}
            </div>
          </div>

          {selCard && (
            <div style={{ margin: '8px 24px 0', background: T.surface, borderRadius: 20, padding: '18px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 12, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>Card Balance</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>{F.money(selCard.balance)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', fontSize: 12, color: T.muted }}>Card name</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text }}>{selCard.name}</p>
              </div>
            </div>
          )}

          <div style={{ margin: '16px 24px 0' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {cardActions.map((a) => (
                <button key={a.label} onClick={a.onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: T.surface, border: 'none', borderRadius: 16, padding: '14px 8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', WebkitTapHighlightColor: 'transparent' }}>
                  <Icon name={a.icon} size={20} color={T.accent} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: T.muted }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px 24px 0' }}>
            <SectionHeader title="Card Activity" action="All" onAction={() => navigate('transactions', {}, 'forward')} />
            <div style={{ background: T.surface, borderRadius: 20, padding: '4px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              {recentTxs.map((tx, i) => (
                <div key={tx.id}>
                  <TxItem tx={tx} />
                  {i < recentTxs.length - 1 && <div style={{ height: 1, background: T.borderLight }} />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Transactions ──────────────────────────────────────────────
export function TransactionsScreen(_props: ScreenProps) {
  const [all] = useState<Tx[]>(BankAPI.getTransactions());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = all.filter((tx) => {
    const matchQ = query === '' || tx.name.toLowerCase().includes(query.toLowerCase()) || tx.category.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'all' || (filter === 'income' && tx.amount > 0) || (filter === 'expense' && tx.amount < 0);
    return matchQ && matchF;
  });

  const groups: Record<string, Tx[]> = {};
  filtered.forEach((tx) => {
    (groups[tx.date] = groups[tx.date] || []).push(tx);
  });
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const filters = ['all', 'income', 'expense'];

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      <div style={{ padding: '20px 24px 0' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>Transactions</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.surface, borderRadius: 14, padding: '0 16px', height: 48, border: `1.5px solid ${T.border}`, marginBottom: 14 }}>
          <Icon name="search" size={18} color={T.muted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: T.text }} />
          {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}><Icon name="x" size={16} color={T.muted} /></button>}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, WebkitTapHighlightColor: 'transparent', background: filter === f ? T.accent : T.surface, color: filter === f ? '#fff' : T.muted, boxShadow: filter === f ? `0 3px 10px ${T.accent}44` : '0 1px 4px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {sortedDates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: T.faint }}>
            <Icon name="search" size={36} color={T.border} style={{ margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 15 }}>No transactions found</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: T.muted, letterSpacing: 0.3 }}>{F.date(date)}</p>
              <div style={{ background: T.surface, borderRadius: 20, padding: '4px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                {groups[date].map((tx, i) => (
                  <div key={tx.id}>
                    <TxItem tx={tx} />
                    {i < groups[date].length - 1 && <div style={{ height: 1, background: T.borderLight }} />}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────
export function NotificationsScreen(_props: ScreenProps) {
  const [notifs, setNotifs] = useState<Notif[]>(BankAPI.getNotifications());

  const markAll = () => {
    BankAPI.markAllRead();
    setNotifs(BankAPI.getNotifications());
  };

  const iconMap: Record<string, { bg: string; color: string; icon: string }> = {
    credit: { bg: T.successLight, color: T.success, icon: 'income' },
    debit: { bg: '#3A2A1A', color: T.warning, icon: 'expense' },
    info: { bg: T.accentLight, color: T.accent, icon: 'info' },
    promo: { bg: '#3A1A2A', color: '#EC4899', icon: 'promo' },
  };
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div style={{ background: T.bg, minHeight: '100%', paddingBottom: 16 }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>Notifications</h2>
            {unread > 0 && <span style={{ fontSize: 13, color: T.muted }}>{unread} unread</span>}
          </div>
          {unread > 0 && <button onClick={markAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: T.accent, WebkitTapHighlightColor: 'transparent' }}>Mark all read</button>}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {notifs.map((n) => {
          const ic = iconMap[n.type] || iconMap.info;
          return (
            <div key={n.id} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: T.surface, borderRadius: 16, marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.2)', opacity: n.read ? 0.75 : 1, transition: 'opacity 0.2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: ic.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={ic.icon} size={20} color={ic.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{n.title}</span>
                  <span style={{ fontSize: 12, color: T.faint, flexShrink: 0 }}>{n.time}</span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: T.muted, lineHeight: 1.4 }}>{n.body}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: 4, background: T.accent, flexShrink: 0, marginTop: 4 }} />}
            </div>
          );
        })}
        {notifs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint }}>
            <Icon name="bell" size={36} color={T.border} style={{ margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 15 }}>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
