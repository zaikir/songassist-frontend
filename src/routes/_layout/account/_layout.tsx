import type { FileRouteTypes } from 'src/routeTree.gen';

import { useAtomValue } from 'jotai';
import { removeLastSlash } from 'minimal-shared/utils';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { Tab, Tabs, Portal } from '@mui/material';

import { RouterLink, usePathname } from 'src/shared/router';
import {
  DashboardLayout,
  DashboardContent,
  useDashboardLayout,
} from 'src/shared/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export const Route = createFileRoute('/_layout/account/_layout')({
  component: AccountLayout,
});

const NAV_ITEMS = [
  {
    label: 'General',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: '/account',
  },
  {
    label: 'Subscription',
    icon: <Iconify width={24} icon="solar:bill-list-bold" />,
    href: `/account/billing`,
  },
  // {
  //   label: 'Notifications',
  //   icon: <Iconify width={24} icon="solar:bell-bing-bold" />,
  //   href: `/account/notifications`,
  // },
] satisfies {
  label: string;
  icon: React.ReactNode;
  href: FileRouteTypes['fullPaths'];
}[];

export function AccountLayout() {
  const pathname = usePathname();

  return (
    <DashboardLayout>
      <DashboardContent>
        <AccountLayoutHeader />

        <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
          {NAV_ITEMS.map((tab) => (
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
    </DashboardLayout>
  );
}

function AccountLayoutHeader() {
  const { headerContainerRefAtom } = useDashboardLayout();
  const headerContainerRef = useAtomValue(headerContainerRefAtom);

  if (!headerContainerRef) {
    return null;
  }

  return (
    <Portal container={headerContainerRef}>
      <CustomBreadcrumbs heading="Profile Settings" />
    </Portal>
  );
}
