import { createFileRoute } from '@tanstack/react-router';

import { ProjectIntegrationsPage } from 'src/features/projects/project-integrations-page';

export const Route = createFileRoute(
  '/_layout/projects/$project/_layout/settings/_layout/integrations'
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectIntegrationsPage />;
}
