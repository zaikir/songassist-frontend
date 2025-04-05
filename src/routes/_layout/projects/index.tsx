import { useEffect } from 'react';
import { useNavigate, createFileRoute } from '@tanstack/react-router';

import { AuthGuard } from 'src/features/auth';
import { useProjects } from 'src/features/projects';
import { DashboardLayout } from 'src/shared/layouts/dashboard';

export const Route = createFileRoute('/_layout/projects/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [project] = useProjects();
  const navigate = useNavigate();

  useEffect(() => {
    if (!project) {
      return;
    }

    navigate({ from: '/projects', to: '/projects/' + project.id });
  }, [navigate, project]);

  return (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  );
}
