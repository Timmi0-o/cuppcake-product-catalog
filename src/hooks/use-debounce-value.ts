'use client';

import { useEffect, useState } from 'react';

export const useDebounceValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      window.clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
