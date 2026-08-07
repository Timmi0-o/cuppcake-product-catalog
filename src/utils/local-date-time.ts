export const formatLocalDateTimeValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const parseLocalDateTimeValue = (value: string): Date => {
  if (!value.trim()) {
    const nextSlot = new Date();
    nextSlot.setSeconds(0, 0);
    nextSlot.setMinutes(Math.ceil(nextSlot.getMinutes() / 30) * 30);

    if (nextSlot.getMinutes() >= 60) {
      nextSlot.setMinutes(0);
      nextSlot.setHours(nextSlot.getHours() + 1);
    }

    return nextSlot;
  }

  const parsed = new Date(value.trim().replace(' ', 'T'));

  if (Number.isNaN(parsed.getTime())) {
    return parseLocalDateTimeValue('');
  }

  return parsed;
};

export const getTimePartFromLocalDateTimeValue = (value: string): string => {
  const parsed = parseLocalDateTimeValue(value);

  return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`;
};

export const getDatePartFromLocalDateTimeValue = (
  value: string,
): Date | undefined => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = parseLocalDateTimeValue(value);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const combineLocalDateTimeParts = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);

  return formatLocalDateTimeValue(combined);
};
