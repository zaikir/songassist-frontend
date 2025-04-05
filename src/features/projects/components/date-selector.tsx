import dayjs from 'dayjs';
import { useSearch, useNavigate } from '@tanstack/react-router';

import { Button } from '@mui/material';

import { useDateRangePicker } from 'src/hooks/use-date-range-picker';

import { Iconify } from 'src/components/iconify';

export function DateSelector() {
  const navigate = useNavigate({ from: '/projects/$project' });
  const { start_date: startDate, end_date: endDate } = useSearch({
    from: '/_layout/projects/$project/_layout',
  });
  const { openPicker } = useDateRangePicker();

  const isDateFilterSelected = startDate && endDate;

  return (
    <Button
      onClick={async () => {
        const result = await openPicker(
          startDate && endDate ? { start: startDate, end: endDate } : undefined
        );
        if (result === false) {
          return;
        }

        if (result === null) {
          navigate({
            search: (prev) => ({ ...prev, start_date: undefined, end_date: undefined }),
          });
          return;
        }

        navigate({
          search: (prev) => ({ ...prev, start_date: result.start, end_date: result.end }),
        });
      }}
      startIcon={<Iconify icon={isDateFilterSelected ? 'mdi:calendar-outline' : 'mdi:add'} />}
      sx={{ fontWeight: 600, opacity: isDateFilterSelected ? 1 : 1 }}
    >
      {isDateFilterSelected
        ? `${dayjs(startDate).format('MMM D, YYYY')} - ${dayjs(endDate).format('MMM D, YYYY')}`
        : 'Add date filter'}
    </Button>
  );
}
