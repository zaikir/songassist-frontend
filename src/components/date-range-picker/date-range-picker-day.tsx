import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay/PickersDay';

import dayjs from 'dayjs';

import { Tooltip } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers/PickersDay/PickersDay';

// ----------------------------------------------------------------------

export default function DateRangePickerDay({
  startDate,
  endDate,
  mode,
  ...props
}: PickersDayProps<any> & {
  startDate: string;
  endDate: string;
  mode: 'start' | 'end';
}) {
  const isBetween = dayjs(props.day).isAfter(startDate) && dayjs(props.day).isBefore(endDate);
  const isDisabled =
    (mode === 'start' && dayjs(props.day).isSame(dayjs(endDate))) ||
    (mode === 'end' && dayjs(props.day).isSame(dayjs(startDate)));

  const isCurrentDay =
    (mode === 'start' && dayjs(props.day).isSame(dayjs(startDate))) ||
    (mode === 'end' && dayjs(props.day).isSame(dayjs(endDate)));

  const dayContent = (
    <PickersDay
      {...props}
      disabled={isDisabled && startDate !== endDate}
      sx={{
        ...(isBetween && {
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#283d54' : '#e5f9ff'),
          '&:hover': {
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#274362' : '#d6f0f8'),
          },
        }),
        ...(isDisabled && {
          backgroundColor: '#a82831',
          color: 'white !important',
          '&:hover': {
            backgroundColor: '#a82831',
          },
        }),
      }}
    />
  );

  if (isDisabled || isCurrentDay) {
    return (
      <Tooltip
        PopperProps={{
          sx: { pointerEvents: 'none' },
        }}
        title={
          mode === 'start'
            ? `${isDisabled ? 'End' : 'Start'} date`
            : `${isDisabled ? 'Start' : 'End'} date`
        }
      >
        <span>{dayContent}</span>
      </Tooltip>
    );
  }

  return dayContent;
}
