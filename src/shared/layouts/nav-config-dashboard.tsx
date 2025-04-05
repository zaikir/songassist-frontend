import type { Project } from 'src/types/entities';
import type { NavSectionProps } from 'src/components/nav-section';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = (project: Project) =>
  [
    /**
     * Overview
     */
    {
      subheader: '',
      items: [
        {
          title: 'Assistent',
          path: `/projects/${project.id}`,
          icon: ICONS.chat,
        },
      ],
    },
    {
      subheader: 'Project Management',
      items: [
        {
          title: 'Team',
          path: `/projects/${project.id}/team`,
          icon: <Iconify icon="mdi:domain" />,
        },
        {
          title: 'Settings',
          path: `/projects/${project.id}/settings`,
          icon: <Iconify icon="tabler:settings" />,
          exact: false,
        },
      ],
    },
  ] as NavSectionProps['data'];
