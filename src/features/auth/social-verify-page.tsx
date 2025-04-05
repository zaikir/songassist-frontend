import { useMountEffect } from 'src/hooks/use-mount-effect';

import { api } from 'src/api';

import { SplashScreen } from 'src/components/loading-screen';

export function SocialVerifyPage({ type }: { type: 'google' | 'github' }) {
  useMountEffect(async () => {
    await api[type === 'github' ? 'verifyGithubAuth' : 'verifyGoogleAuth']();
    window.location.href = '/';
  });

  return <SplashScreen />;
}
