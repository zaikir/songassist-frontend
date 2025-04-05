import { createFileRoute } from '@tanstack/react-router';

import { GuestGuard } from 'src/features/auth/guard';
import { SignInPage } from 'src/features/auth/sign-in-page';
import { AuthSplitLayout } from 'src/shared/layouts/auth-split';

export const Route = createFileRoute('/auth/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: { title: 'Hi, Welcome back' },
        }}
      >
        <SignInPage />
      </AuthSplitLayout>
    </GuestGuard>
  );
}
