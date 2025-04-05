import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Typography } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from '../iconify';
import { shortcutsItems } from './shortcuts-items';
import DateRangePickerDay from './date-range-picker-day';

import type { DateRangePickerProps } from './types';

// ----------------------------------------------------------------------

export function DateRangePickerDialog({
  title = 'Select date range',
  variant = 'calendar',
  //
  startDate,
  endDate,
  //
  onAccept,
  onCancel,
  //
  open,
  onClose,
  //
  error,
}: DateRangePickerProps) {
  const mdUp = useResponsive('up', 'md');

  const [currentStartDate, setCurrentStartDate] = useState(startDate ? dayjs(startDate) : null);
  const [currentEndDate, setCurrentEndDate] = useState(endDate ? dayjs(endDate) : null);

  const currentStartDateRef = useRef(currentStartDate);
  const currentEndDateRef = useRef(currentEndDate);

  const onChangeCurrentStartDate = useCallback((newValue: Dayjs | null) => {
    console.log({ newValue: newValue?.toDate() });
    setCurrentStartDate(newValue!);

    currentStartDateRef.current = newValue!;

    if (newValue!.isAfter(currentEndDateRef.current)) {
      onChangeCurrentEndDate(newValue!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeCurrentEndDate = useCallback((newValue: Dayjs | null) => {
    const newEndDate = newValue!;
    setCurrentEndDate(newEndDate);

    currentEndDateRef.current = newEndDate;

    if (newEndDate.isBefore(dayjs(currentStartDateRef.current))) {
      onChangeCurrentStartDate(newEndDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCalendarView = variant === 'calendar';

  const shortcutButtons = shortcutsItems.map((item) => {
    const [newStartDate, newEndDate] = item.getValue();

    const isSelected =
      dayjs(newStartDate).format('YYYY-MM-DD') === dayjs(currentStartDate).format('YYYY-MM-DD') &&
      dayjs(newEndDate).format('YYYY-MM-DD') === dayjs(currentEndDate).format('YYYY-MM-DD');

    return (
      <Button
        key={item.label}
        variant="text"
        sx={{ width: 130, fontWeight: isSelected ? '700' : '500', px: 1 }}
        color={isSelected ? 'primary' : 'inherit'}
        onClick={() => {
          onChangeCurrentStartDate(dayjs(newStartDate));
          onChangeCurrentEndDate(dayjs(newEndDate));
        }}
      >
        {item.label}
      </Button>
    );
  });

  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isCalendarView && {
            maxWidth: 880,
          }),
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center' }}>
        {title}
        {startDate && endDate && (
          <Button
            sx={{ ml: 3 }}
            startIcon={<Iconify icon="ic:round-refresh" />}
            onClick={() => {
              onAccept({ start: null, end: null });
            }}
          >
            Clear selection
          </Button>
        )}
        <IconButton
          onClick={() => {
            onCancel();
          }}
          sx={{ ml: 'auto' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          ...(isCalendarView &&
            mdUp && {
              overflow: 'unset',
            }),
        }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && mdUp ? 'row' : 'column'}
          sx={{ pt: 1 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {shortcutButtons}
          </Box>

          {isCalendarView ? (
            <>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  borderStyle: 'dashed',
                }}
              >
                <Stack direction="column" spacing={0}>
                  <Typography
                    sx={{
                      py: 0.5,
                      pl: 3,
                      borderBottom: '1px dashed rgba(145, 158, 171, 0.2)',
                      fontWeight: 'bold',
                    }}
                  >
                    Start date
                  </Typography>

                  <DateCalendar
                    value={currentStartDate}
                    onChange={onChangeCurrentStartDate}
                    disableHighlightToday
                    slots={{
                      day: DateRangePickerDay as any,
                    }}
                    slotProps={{
                      day: {
                        startDate: currentStartDate,
                        endDate: currentEndDate,
                        mode: 'start',
                      } as any,
                    }}
                  />
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  borderStyle: 'dashed',
                }}
              >
                <Stack direction="column" spacing={0}>
                  <Typography
                    sx={{
                      py: 0.5,
                      pl: 3,
                      borderBottom: '1px dashed rgba(145, 158, 171, 0.2)',
                      fontWeight: 'bold',
                    }}
                  >
                    End date
                  </Typography>
                  <DateCalendar
                    value={currentEndDate}
                    onChange={onChangeCurrentEndDate}
                    disableHighlightToday
                    slots={{
                      day: DateRangePickerDay as any,
                    }}
                    slotProps={{
                      day: {
                        startDate: currentStartDate,
                        endDate: currentEndDate,
                        mode: 'end',
                      } as any,
                    }}
                  />
                </Stack>
              </Paper>
            </>
          ) : (
            <>
              <DatePicker
                label="Start date"
                value={dayjs(currentStartDate)}
                onChange={onChangeCurrentStartDate}
              />

              <DatePicker
                label="End date"
                value={dayjs(currentEndDate)}
                onChange={onChangeCurrentEndDate}
              />
            </>
          )}
        </Stack>

        {error && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            onCancel();
            onClose();
          }}
        >
          Cancel
        </Button>

        <Button
          disabled={error}
          variant="contained"
          onClick={() => {
            onAccept({
              start: currentStartDate ? currentStartDate.format('YYYY-MM-DD') : null,
              end: currentEndDate ? currentEndDate.format('YYYY-MM-DD') : null,
            });
            onClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
