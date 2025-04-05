import { useAtomValue } from 'jotai';
import { removeLastSlash } from 'minimal-shared/utils';
import { Outlet, useMatches, createFileRoute } from '@tanstack/react-router';

import { Tab, Tabs, Portal } from '@mui/material';

import { RouterLink } from 'src/shared/router';
import { DashboardContent, useDashboardLayout } from 'src/shared/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const Route = createFileRoute('/_layout/projects/$project/_layout/settings/_layout')({
  component: AccountLayout,
});

export function AccountLayout() {
  const matches = useMatches();

  const tabs = [
    {
      label: 'General',
      icon: <Iconify width={24} icon="solar:user-id-bold" />,
      href: Route.fullPath,
    },
    {
      label: 'Integrations',
      icon: <Iconify width={18} icon="solar:link-bold" />,
      href: `${Route.fullPath}/integrations`,
    },
  ] satisfies {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];

  return (
    <DashboardContent>
      <SettingsLayoutHeader />

      <Tabs
        value={removeLastSlash(matches[matches.length - 1].fullPath)}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {tabs.map((tab) => (
          <Tab
            component={RouterLink}
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            value={tab.href}
            href={tab.href}
          />
        ))}
      </Tabs>

      <Outlet />
    </DashboardContent>
  );
}

function SettingsLayoutHeader() {
  const { headerContainerRefAtom } = useDashboardLayout();
  const headerContainerRef = useAtomValue(headerContainerRefAtom);

  if (!headerContainerRef) {
    return null;
  }

  return (
    <Portal container={headerContainerRef}>
      <CustomBreadcrumbs heading="Project Settings" />
    </Portal>
  );
}
