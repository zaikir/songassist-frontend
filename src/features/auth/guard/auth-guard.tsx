import { useEffect } from 'react';
import { useAtomValue } from 'jotai';

import { isAppInitializedAtom } from 'src/features/bootstrap';

import { SplashScreen } from 'src/components/loading-screen';

import { useUser } from '../hooks/use-user';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const user = useUser();
  const isAppInitialized = useAtomValue(isAppInitializedAtom);

  const checkPermissions = async (): Promise<void> => {
    if (!isAppInitialized) {
      return;
    }

    if (!user) {
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/sign-in';
      }

      return;
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user == null, isAppInitialized]);

  if (!isAppInitialized || !user) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
