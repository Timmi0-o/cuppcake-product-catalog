'use client';

import { Select } from '@/components/shared/ui/select';
import { cn } from '@/lib/utils';
import { buildTimeOfDayOptions } from '@/utils/build-time-of-day-options';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface ITimePickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  className?: string;
  placeholder?: string;
  'aria-invalid'?: boolean;
  disabled?: boolean;
  stepMinutes?: number;
}

export const TimePicker = ({
  value,
  onChange,
  onBlur,
  id,
  className,
  placeholder,
  'aria-invalid': ariaInvalid,
  disabled = false,
  stepMinutes = 30,
}: ITimePickerProps) => {
  const tPlaceholder = useTranslations('ui.placeholder');
  const options = useMemo(
    () => buildTimeOfDayOptions(stepMinutes),
    [stepMinutes],
  );

  return (
    <Select
      value={value || null}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
      items={options.map((time) => ({
        value: time,
        label: time,
      }))}
    >
      <Select.Trigger
        id={id}
        className={cn('w-full', className)}
        aria-invalid={ariaInvalid}
        onBlur={onBlur}
      >
        <Select.Value placeholder={placeholder ?? tPlaceholder('selectTime')} />
      </Select.Trigger>
      <Select.Content>
        {options.map((time) => (
          <Select.Item key={time} value={time}>
            {time}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
