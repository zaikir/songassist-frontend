import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { Outlet, useNavigate, createFileRoute } from '@tanstack/react-router';

import { DashboardLayout } from 'src/shared/layouts/dashboard';
import { useProjects, selectedProjectIdAtom } from 'src/features/projects';

export const Route = createFileRoute('/_layout/projects/$project/_layout')({
  component: RouteComponent,
  validateSearch: (search) => {
    const start_date = validateDate(search['start_date'] as string);
    const end_date = validateDate(search['end_date'] as string);

    if (!start_date || !end_date) {
      return {
        start_date: undefined,
        end_date: undefined,
      };
    }

    return {
      start_date,
      end_date,
    };
  },
});

function RouteComponent() {
  const { project: projectFromParams } = Route.useParams();

  const navigate = useNavigate();
  const projects = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useAtom(selectedProjectIdAtom);

  useEffect(() => {
    if (
      !projects.length ||
      (projectFromParams && !projects.find((p) => p.id === projectFromParams))
    ) {
      navigate({ to: '/projects' });
      return;
    }

    setSelectedProjectId(projectFromParams);
  }, [navigate, projectFromParams, projects, selectedProjectId, setSelectedProjectId]);

  if (!selectedProjectId) {
    return null;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

const validateDate = (dateStr?: string) =>
  !dateStr ? null : dayjs(dateStr, 'YYYY-MM-DD', true).isValid() ? dateStr : null;
