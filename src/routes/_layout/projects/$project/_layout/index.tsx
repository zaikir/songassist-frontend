import { createFileRoute } from '@tanstack/react-router';

import { OverviewPage } from 'src/features/overview/overview-page';

export const Route = createFileRoute('/_layout/projects/$project/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <OverviewPage />;
}
