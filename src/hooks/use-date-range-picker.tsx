import React, { useCallback } from 'react';

// or your preferred Dialog component
import { useModal } from 'src/components/modal-provider';
import { DateRangePickerDialog } from 'src/components/date-range-picker';

export type DateRange = {
  start: string;
  end: string;
};

export function useDateRangePicker() {
  const { showModal } = useModal();

  const openPicker = useCallback(
    (range?: DateRange) =>
      new Promise<DateRange | null | false>((resolve) => {
        const { closeModal } = showModal(
          <DateRangePickerDialog
            open
            onClose={() => {}}
            startDate={range?.start ?? null}
            endDate={range?.end ?? null}
            onAccept={(x) => {
              if (x.start && x.end) {
                resolve(x as any);
              } else {
                resolve(null);
              }

              closeModal();
            }}
            onCancel={() => {
              resolve(false);
              closeModal();
            }}
          />
        );
      }),
    [showModal]
  );

  return { openPicker };
}
