// ----------------------------------------------------------------------

export type DateRangePickerProps = {
  startDate: string | null;
  endDate: string | null;

  onAccept: (result: { start: string | null; end: string | null }) => void;
  onCancel: () => void;
  //
  open: boolean;
  onOpen?: VoidFunction;
  onClose: VoidFunction;
  onReset?: VoidFunction;
  //
  selected?: boolean;
  error?: boolean;
  //
  label?: string;
  shortLabel?: string;
  //
  title?: string;
  variant?: 'calendar' | 'input';
  //
  setStartDate?: React.Dispatch<React.SetStateAction<string>>;
  setEndDate?: React.Dispatch<React.SetStateAction<string>>;
};

export type ShortcutsItem = {
  label: string;
  getValue: () => [Date, Date];
};
