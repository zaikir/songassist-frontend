import { createFileRoute } from '@tanstack/react-router';

import { ComingSoonView } from 'src/components/coming-soon/view';

export const Route = createFileRoute('/_layout/projects/$project/_layout/team')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoonView />;
}
