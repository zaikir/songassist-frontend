import { Outlet, createFileRoute } from '@tanstack/react-router';

import { DashboardLayout } from 'src/shared/layouts/dashboard';

export const Route = createFileRoute('/_layout/chats/$chat/_layout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
