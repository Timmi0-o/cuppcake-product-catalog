'use client';

import { useLayoutEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [isMatches, setIsMatches] = useState(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => {
      setIsMatches(mediaQuery.matches);
    };

    updateMatches();
    mediaQuery.addEventListener('change', updateMatches);

    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return isMatches;
};
