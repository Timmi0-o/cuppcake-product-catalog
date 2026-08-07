'use client';

import { DatePicker } from '@/components/shared/ui/date-picker';
import { TimePicker } from '@/components/shared/ui/time-picker';
import { cn } from '@/lib/utils';
import {
  combineLocalDateTimeParts,
  getDatePartFromLocalDateTimeValue,
  getTimePartFromLocalDateTimeValue,
  parseLocalDateTimeValue,
} from '@/utils/local-date-time';

interface IDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  className?: string;
  dateId?: string;
  timeId?: string;
  'aria-invalid'?: boolean;
  disabled?: boolean;
}

export const DateTimePicker = ({
  value,
  onChange,
  onBlur,
  id,
  className,
  dateId,
  timeId,
  'aria-invalid': ariaInvalid,
  disabled = false,
}: IDateTimePickerProps) => {
  const selectedDate = getDatePartFromLocalDateTimeValue(value);
  const selectedTime = value.trim()
    ? getTimePartFromLocalDateTimeValue(value)
    : getTimePartFromLocalDateTimeValue(
        combineLocalDateTimeParts(parseLocalDateTimeValue(''), '09:00'),
      );

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      onChange('');
      return;
    }

    onChange(combineLocalDateTimeParts(date, selectedTime));
  };

  const handleTimeChange = (time: string) => {
    const baseDate = selectedDate ?? parseLocalDateTimeValue('');
    onChange(combineLocalDateTimeParts(baseDate, time));
  };

  return (
    <div
      id={id}
      className={cn('grid gap-2 sm:grid-cols-2', className)}
      onBlur={onBlur}
    >
      <DatePicker
        id={dateId}
        value={selectedDate}
        onChange={handleDateChange}
        aria-invalid={ariaInvalid}
        disabled={disabled}
      />
      <TimePicker
        id={timeId}
        value={selectedTime}
        onChange={handleTimeChange}
        aria-invalid={ariaInvalid}
        disabled={disabled}
      />
    </div>
  );
};
