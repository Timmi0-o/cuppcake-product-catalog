'use client';

import { Button } from '@/components/shared/ui/button';
import { Calendar } from '@/components/shared/ui/calendar';
import { Popover } from '@/components/shared/ui/popover';
import type { AppLocale } from '@/constants/locales';
import { getDateFnsLocale } from '@/helpers/i18n/date-fns-locale';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface IDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  onBlur?: () => void;
  id?: string;
  className?: string;
  placeholder?: string;
  'aria-invalid'?: boolean;
  disabled?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  onBlur,
  id,
  className,
  placeholder,
  'aria-invalid': ariaInvalid,
  disabled = false,
}: IDatePickerProps) => {
  const locale = useLocale() as AppLocale;
  const tPlaceholder = useTranslations('ui.placeholder');
  const dateFnsLocale = getDateFnsLocale(locale);
  const label = value
    ? format(value, 'PPP', { locale: dateFnsLocale })
    : (placeholder ?? tPlaceholder('pickDate'));

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          onBlur?.();
        }
      }}
    >
      <Popover.Trigger
        id={id}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start font-normal',
              !value && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <CalendarIcon className="size-4" />
        <span className="truncate">{label}</span>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
          }}
          locale={dateFnsLocale}
          captionLayout="dropdown"
          startMonth={new Date(new Date().getFullYear() - 1, 0)}
          endMonth={new Date(new Date().getFullYear() + 2, 11)}
        />
      </Popover.Content>
    </Popover>
  );
};
