import { useEffect } from 'react';
import { useAtomValue } from 'jotai';

import { isAppInitializedAtom } from 'src/features/bootstrap';

import { SplashScreen } from 'src/components/loading-screen';

import { useUser } from '../hooks/use-user';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const user = useUser();

  const isAppInitialized = useAtomValue(isAppInitializedAtom);

  const checkPermissions = async (): Promise<void> => {
    if (!isAppInitialized) {
      return;
    }

    if (user != null) {
      return;
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user == null, isAppInitialized]);

  if (!isAppInitialized) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
