import dayjs from 'dayjs';

import type { ShortcutsItem } from './types';

export const shortcutsItems: ShortcutsItem[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('day').toDate(), today.endOf('day').toDate()];
    },
  },
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week').toDate(), today.endOf('week').toDate()];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(6, 'day').toDate(), today.toDate()];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month').toDate(), today.endOf('month').toDate()];
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(30, 'day').toDate(), today.toDate()];
    },
  },
  {
    label: 'Last 6 Months',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(6, 'month').toDate(), today.toDate()];
    },
  },
  {
    label: 'Current Year',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('year').toDate(), today.endOf('year').toDate()];
    },
  },
  {
    label: 'Last Year',
    getValue: () => {
      const yearAgo = dayjs().subtract(1, 'year');
      return [yearAgo.startOf('year').toDate(), yearAgo.endOf('year').toDate()];
    },
  },
  {
    label: 'Last 365 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(365, 'day').toDate(), today.toDate()];
    },
  },
];
