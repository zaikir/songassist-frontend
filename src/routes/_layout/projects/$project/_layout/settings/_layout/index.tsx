import { createFileRoute } from '@tanstack/react-router';

import { ProjectSettingsPage } from 'src/features/projects/project-settings-page';

export const Route = createFileRoute('/_layout/projects/$project/_layout/settings/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectSettingsPage />;
}
