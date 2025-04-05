import { Outlet, createFileRoute } from '@tanstack/react-router';

import { AuthGuard } from 'src/features/auth/guard';

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
}
