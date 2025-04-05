import { useSearch } from '@tanstack/react-router';

import { useMountEffect } from 'src/hooks/use-mount-effect';

import { api } from 'src/api';

import { SplashScreen } from 'src/components/loading-screen';

export function EmailVerifyPage() {
  const { preAuthSessionId } = useSearch({ from: '/auth/email-verify' });
  const linkCode = window.location.hash.replace('#', '');

  useMountEffect(async () => {
    if (!linkCode || !preAuthSessionId) {
      return;
    }

    await api.verifyEmailAuth(linkCode, preAuthSessionId);
    window.location.href = '/';
  });

  return <SplashScreen />;
}
