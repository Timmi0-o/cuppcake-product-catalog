'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from 'react';

type UseInfiniteScrollObserverOptions = {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

type UseInfiniteScrollObserverResult = {
  sentinelRef: RefCallback<Element>;
  rootRef: RefCallback<Element>;
};

export const useInfiniteScrollObserver = ({
  onLoadMore,
  hasMore,
  isLoading,
  enabled = true,
  rootMargin = '120px 0px',
  threshold = 0,
}: UseInfiniteScrollObserverOptions): UseInfiniteScrollObserverResult => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const sentinelNodeRef = useRef<Element | null>(null);
  const rootNodeRef = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const disconnectObserver = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  const observe = useCallback(() => {
    disconnectObserver();

    const sentinel = sentinelNodeRef.current;
    if (!sentinel || !enabled) {
      setIsIntersecting(false);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(Boolean(entries[0]?.isIntersecting));
      },
      {
        root: rootNodeRef.current,
        rootMargin,
        threshold,
      },
    );

    observerRef.current.observe(sentinel);
  }, [disconnectObserver, enabled, rootMargin, threshold]);

  useEffect(() => {
    observe();
    return disconnectObserver;
  }, [observe, disconnectObserver]);

  useEffect(() => {
    if (!enabled || !hasMore || isLoading || !isIntersecting) {
      return;
    }

    onLoadMoreRef.current();
  }, [enabled, hasMore, isLoading, isIntersecting]);

  const sentinelRef = useCallback<RefCallback<Element>>(
    (node) => {
      sentinelNodeRef.current = node;
      observe();
    },
    [observe],
  );

  const rootRef = useCallback<RefCallback<Element>>(
    (node) => {
      rootNodeRef.current = node;
      observe();
    },
    [observe],
  );

  return { sentinelRef, rootRef };
};
