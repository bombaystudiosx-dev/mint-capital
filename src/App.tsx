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
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(18px, 4vw, 56px)',
        background:
          'radial-gradient(circle at 18% 12%, rgba(16,185,129,0.18), transparent 34%), radial-gradient(circle at 82% 8%, rgba(255,255,255,0.08), transparent 28%), linear-gradient(135deg, #050806 0%, #0A120E 46%, #020403 100%)',
        overflow: 'hidden',
      }}
    >
      <section
        aria-label="Mint Capital app preview"
        style={{
          width: 'min(92vw, 523px)',
          height: 'min(88vh, 874px)',
          minHeight: 'min(760px, calc(100vh - 36px))',
          maxHeight: 874,
          borderRadius: 'clamp(24px, 4vw, 38px)',
          padding: 1,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.20), rgba(16,185,129,0.20) 42%, rgba(255,255,255,0.06))',
          boxShadow: '0 34px 90px rgba(0,0,0,0.42), 0 0 70px rgba(16,185,129,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: bg,
            borderRadius: 'inherit',
            overflow: 'hidden',
            backdropFilter: 'blur(22px) saturate(160%)',
            WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
            <AnimWrapper direction={dir} animKey={animKey}>
              <Screen navigate={navigate} goBack={goBack} {...params} />
            </AnimWrapper>
          </div>
          {showNav ? <BottomNav active={screen} navigate={navigate} /> : <div style={{ height: 34, background: bg, flexShrink: 0 }} />}
        </div>
      </section>
    </main>
  );
}
