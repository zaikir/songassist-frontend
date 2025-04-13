import { createFileRoute } from '@tanstack/react-router';

import { DashboardLayout } from 'src/shared/layouts/dashboard';
import { OverviewPage } from 'src/features/overview/overview-page';

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardLayout>
      <OverviewPage />
    </DashboardLayout>
  );
}
