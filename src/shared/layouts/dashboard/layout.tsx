import type { Chat } from 'src/types/entities';
import type { Breakpoint } from '@mui/material/styles';
import type { NavListProps, NavSectionProps } from 'src/components/nav-section';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';
import { useAtomValue, getDefaultStore } from 'jotai';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { chatsAtom } from 'src/features/bootstrap';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { NavMobile } from './nav-mobile';
import { VerticalDivider } from './content';
import { NavVertical } from './nav-vertical';
import { layoutClasses } from '../core/classes';
import { ICONS } from '../nav-config-dashboard';
import { NavHorizontal } from './nav-horizontal';
import { MainSection } from '../core/main-section';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { useDashboardLayout } from './use-dashboard-layout';
import { AccountDrawer } from '../components/account-drawer';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavSectionProps['data'];
    };
    main?: MainSectionProps;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const chats = useAtomValue(chatsAtom);

  const { headerContainerRefAtom } = useDashboardLayout();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = [
    {
      subheader: '',
      items: [
        {
          title: 'Assistent',
          path: `/`,
          icon: ICONS.chat,
        },
      ],
    },

    ...(getNavData(chats) as any),
    // {
    //   subheader: 'Project Management',
    //   items: [
    //     {
    //       title: 'Team',
    //       path: `/projects/${project.id}/team`,
    //       icon: <Iconify icon="mdi:domain" />,
    //     },
    //     {
    //       title: 'Settings',
    //       path: `/projects/${project.id}/settings`,
    //       icon: <Iconify icon="tabler:settings" />,
    //       exact: false,
    //     },
    //   ],
    // },
  ];

  const isNavMini = settings.state.navLayout === 'mini';
  const isNavHorizontal = settings.state.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

  const menuBottomSlot: NavListProps[] = [
    {
      data: {
        path: '/account',
        title: 'Profile Settings',
        icon: <Iconify icon="solar:user-id-bold" />,
        exact: false,
      },
    },
  ];

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: 'var(--layout-nav-bg)',
            height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
            [`& .${iconButtonClasses.root}`]: { color: 'var(--layout-nav-text-secondary-color)' },
          }),
        },
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      bottomArea: isNavHorizontal ? (
        <NavHorizontal
          data={navData}
          layoutQuery={layoutQuery}
          cssVars={navVars.section}
          bottomItems={menuBottomSlot}
        />
      ) : null,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile
            data={navData}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
            bottomItems={menuBottomSlot}
          />

          {/** @slot Logo */}
          {isNavHorizontal && (
            <Logo
              sx={{
                display: 'none',
                [theme.breakpoints.up(layoutQuery)]: { display: 'inline-flex' },
              }}
            />
          )}

          {/** @slot Divider */}
          {isNavHorizontal && (
            <VerticalDivider sx={{ [theme.breakpoints.up(layoutQuery)]: { display: 'flex' } }} />
          )}

          {/** @slot Workspace popover */}
          <Box
            ref={(ref) => {
              const store = getDefaultStore();
              store.set(headerContainerRefAtom, ref as any);
              // if (!store.get(headerContainerRefAtom)) {
              // }
            }}
            sx={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}
          />
          {/* <WorkspacesPopover
            data={_workspaces}
            sx={{ ...(isNavHorizontal && { color: 'var(--layout-nav-text-primary-color)' }) }}
          /> */}
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Searchbar */}
          {/* <Searchbar data={navData} /> */}

          {/** @slot Language popover */}
          {/* <LanguagePopover
            data={[
              { value: 'en', label: 'English', countryCode: 'GB' },
              { value: 'ru', label: 'Russian', countryCode: 'RU', disabled: true },
            ]}
          /> */}

          {/** @slot Notifications popover */}
          {/* <NotificationsDrawer data={_notifications} /> */}

          {/** @slot Contacts popover */}
          {/* <ContactsPopover data={_contacts} /> */}

          {/** @slot Settings button */}
          {/* <SettingsButton /> */}

          {/** @slot Account drawer */}
          <AccountDrawer />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
    />
  );

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={renderSidebar()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

function getNavData(chats: any[]) {
  const today = new Date();

  function getDayLabel(dateString: string): string {
    const chatDate = new Date(dateString);
    const diffTime = today.getTime() - chatDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  const groups = new Map<string, Chat[]>();

  chats.forEach((chat) => {
    const label = getDayLabel(chat.createdAt);
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(chat);
  });

  const navData = Array.from(groups.entries()).map(([subheader, items]) => ({
    subheader,
    items: items.map((chat) => ({
      title: chat.request,
      path: `/chats/${chat.id}`,
    })),
  }));

  return navData;
}
