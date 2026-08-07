const TIME_STEP_MINUTES = 30;

export const buildTimeOfDayOptions = (
  stepMinutes: number = TIME_STEP_MINUTES,
): string[] => {
  const options: string[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      options.push(
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      );
    }
  }

  return options;
};
