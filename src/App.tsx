// Main App router + transitions — ported from bank-app.jsx.
// The dev-only tweaks panel from the prototype is intentionally omitted.

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { T } from './theme';
import { initKYC } from './lib/kyc';
import { initAdmin } from './lib/admin';
import { BottomNav } from './components/ui';
import type { NavDirection, ScreenProps } from './types';

import { SplashScreen, OnboardingScreen, LoginScreen, SignUpScreen, ForgotScreen } from './screens/auth';
import { HomeScreen, WalletScreen, TransactionsScreen, NotificationsScreen } from './screens/main';
import { TransferScreen, AddRecipientScreen, TransferAmountScreen, ConfirmTransferScreen, TransferSuccessScreen, ProfileScreen, SecurityScreen } from './screens/action';
import { KYCWelcomeScreen, KYCPersonalScreen, KYCAddressScreen, KYCEmploymentScreen, KYCDocumentScreen, KYCReviewScreen, KYCApprovedScreen } from './screens/kyc';
import { AdminLoginScreen, AdminDashScreen, AdminCustomerScreen } from './screens/admin';

type ScreenComponent = (props: ScreenProps) => ReactNode;

const SCREENS: Record<string, ScreenComponent> = {
  splash: SplashScreen,
  onboarding: OnboardingScreen,
  login: LoginScreen,
  signup: SignUpScreen,
  forgot: ForgotScreen,
  adminLogin: AdminLoginScreen,
  adminDash: AdminDashScreen,
  adminCustomer: AdminCustomerScreen,
  kycWelcome: KYCWelcomeScreen,
  kycPersonal: KYCPersonalScreen,
  kycAddress: KYCAddressScreen,
  kycEmployment: KYCEmploymentScreen,
  kycDocument: KYCDocumentScreen,
  kycReview: KYCReviewScreen,
  kycApproved: KYCApprovedScreen,
  home: HomeScreen,
  wallet: WalletScreen,
  transactions: TransactionsScreen,
  notifications: NotificationsScreen,
  transfer: TransferScreen,
  addRecipient: AddRecipientScreen,
  transferAmount: TransferAmountScreen,
  confirmTransfer: ConfirmTransferScreen,
  transferSuccess: TransferSuccessScreen,
  profile: ProfileScreen,
  security: SecurityScreen,
};

const MAIN_SCREENS = ['home', 'wallet', 'transactions', 'profile'];

const SCREEN_BG: Record<string, string> = {
  splash: '#0A0D0A',
  onboarding: '#0A0D0A',
  login: T.surface,
  signup: T.surface,
  forgot: T.surface,
  home: T.bg,
  wallet: T.bg,
  transactions: T.bg,
  notifications: T.bg,
  transfer: T.bg,
  addRecipient: T.surface,
  transferAmount: T.bg,
  confirmTransfer: T.bg,
  transferSuccess: T.bg,
  profile: T.bg,
  security: T.bg,
};

function AnimWrapper({ children, direction, animKey }: { children: ReactNode; direction: NavDirection; animKey: number }) {
  const anim =
    {
      forward: 'slideInRight 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
      back: 'slideInLeft  0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
      none: 'fadeIn       0.2s ease-out',
    }[direction] || 'slideInRight 0.28s ease-out';
  return (
    <div key={animKey} style={{ animation: anim, height: '100%', willChange: 'transform' }}>
      {children}
    </div>
  );
}

interface HistEntry {
  screen: string;
  params: Record<string, unknown>;
}

export default function App() {
  useEffect(() => {
    initKYC();
    initAdmin();
  }, []);

  const [screen, setScreen] = useState('splash');
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [dir, setDir] = useState<NavDirection>('none');
  const [animKey, setAnimKey] = useState(0);
  const [, setHist] = useState<HistEntry[]>([]);

  const navigate = useCallback(
    (toScreen: string, toParams: Record<string, unknown> = {}, toDir: NavDirection = 'forward') => {
      setDir(toDir);
      setAnimKey((k) => k + 1);
      setHist((h) => (toDir === 'back' ? h.slice(0, -1) : [...h, { screen, params }]));
      setScreen(toScreen);
      setParams(toParams);
    },
    [screen, params]
  );

  const goBack = useCallback(() => {
    setHist((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setDir('back');
      setAnimKey((k) => k + 1);
      setScreen(prev.screen);
      setParams(prev.params);
      return h.slice(0, -1);
    });
  }, []);

  const showNav = MAIN_SCREENS.includes(screen);
  const bg = SCREEN_BG[screen] || T.bg;

  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
        <AnimWrapper direction={dir} animKey={animKey}>
          <Screen navigate={navigate} goBack={goBack} {...params} />
        </AnimWrapper>
      </div>
      {showNav ? <BottomNav active={screen} navigate={navigate} /> : <div style={{ height: 34, background: bg, flexShrink: 0 }} />}
    </div>
  );
}
