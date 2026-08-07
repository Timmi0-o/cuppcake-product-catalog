'use client';

import {
  animate,
  type MotionStyle,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { useSession } from 'next-auth/react';
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

export type FloatingExpandableSide = 'left' | 'right';

export type FloatingExpandableStoredPosition = {
  side: FloatingExpandableSide;
  /** 0..1 within the vertical free range */
  yRatio: number;
};

const DEFAULT_POSITION: FloatingExpandableStoredPosition = {
  side: 'right',
  yRatio: 0.92,
};

const EDGE_MARGIN = 12;
const DRAG_THRESHOLD_PX = 6;
const MOBILE_BREAKPOINT = 640;
const FALLBACK_SIZE = 36;
const MOBILE_HEADER_FALLBACK_PX = 68;

/** Soft iOS-like settle after release. */
const SNAP_SPRING = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 34,
  mass: 1.05,
};

const SNAP_SPRING_REDUCED = {
  type: 'tween' as const,
  duration: 0,
};

let safeAreaProbe: HTMLDivElement | null = null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getSafeAreaInsets = (): { top: number; bottom: number } => {
  if (typeof document === 'undefined') {
    return { top: 0, bottom: 0 };
  }

  if (!safeAreaProbe) {
    safeAreaProbe = document.createElement('div');
    safeAreaProbe.style.cssText = [
      'position: fixed',
      'visibility: hidden',
      'pointer-events: none',
      'padding-top: env(safe-area-inset-top, 0px)',
      'padding-bottom: env(safe-area-inset-bottom, 0px)',
    ].join(';');
    document.body.appendChild(safeAreaProbe);
  }

  const style = getComputedStyle(safeAreaProbe);

  return {
    top: parseFloat(style.paddingTop) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
  };
};

const isElementVisible = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

/**
 * Layout reserves must ignore CSS transforms (header/nav compact animations),
 * otherwise the badge drifts on page scroll while chrome visually shrinks.
 */
const getTopReserve = () => {
  const header = document.querySelector<HTMLElement>(
    '[data-app-chrome="header"]',
  );

  if (header && isElementVisible(header) && header.offsetHeight > 0) {
    return header.offsetHeight + EDGE_MARGIN;
  }

  const { top: safeTop } = getSafeAreaInsets();
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const headerFallback = isMobile ? MOBILE_HEADER_FALLBACK_PX : 76;

  return headerFallback + safeTop + EDGE_MARGIN;
};

const getBottomReserve = () => {
  const bottomNav = document.querySelector<HTMLElement>(
    '[data-app-chrome="bottom-nav"]',
  );

  if (bottomNav && isElementVisible(bottomNav) && bottomNav.offsetHeight > 0) {
    return bottomNav.offsetHeight + EDGE_MARGIN;
  }

  const { bottom: safeBottom } = getSafeAreaInsets();

  return Math.max(EDGE_MARGIN, safeBottom + EDGE_MARGIN);
};

const getYBounds = (height: number) => {
  const minY = getTopReserve();
  const maxY = Math.max(minY, window.innerHeight - getBottomReserve() - height);

  return { minY, maxY };
};

const resolveTop = (yRatio: number, height: number) => {
  const { minY, maxY } = getYBounds(height);
  return minY + clamp(yRatio, 0, 1) * (maxY - minY);
};

const toYRatio = (top: number, height: number) => {
  const { minY, maxY } = getYBounds(height);
  const range = maxY - minY;
  if (range <= 0) return DEFAULT_POSITION.yRatio;
  return clamp((top - minY) / range, 0, 1);
};

const resolveLeft = (side: FloatingExpandableSide, width: number) =>
  side === 'left'
    ? EDGE_MARGIN
    : Math.max(EDGE_MARGIN, window.innerWidth - EDGE_MARGIN - width);

type TFloatingDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originLeft: number;
  originTop: number;
  moved: boolean;
  width: number;
  height: number;
};

type UseFloatingExpandablePositionOptions = {
  storageKey: string;
  defaultPosition?: FloatingExpandableStoredPosition;
};

export const useFloatingExpandablePosition = ({
  storageKey,
  defaultPosition = DEFAULT_POSITION,
}: UseFloatingExpandablePositionOptions) => {
  const { status: authStatus } = useSession();
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef(0);
  const snapAnimationsRef = useRef<Array<{ stop: () => void }>>([]);
  const isSnapAnimatingRef = useRef(false);
  const reclampToSideRef = useRef<() => void>(() => undefined);
  const [stored, setStored] = useLocalStorage<FloatingExpandableStoredPosition>(
    storageKey,
    defaultPosition,
  );

  const [side, setSide] = useState<FloatingExpandableSide>(stored.side);
  const [top, setTop] = useState(0);
  /** While true, position with `left` even on the right edge (drag / snap). */
  const [isLeftAnchored, setIsLeftAnchored] = useState(stored.side === 'left');
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const leftMv = useMotionValue(0);
  const topMv = useMotionValue(0);

  const dragStateRef = useRef<TFloatingDragState | null>(null);

  const stopSnapAnimations = useCallback(() => {
    for (const animation of snapAnimationsRef.current) {
      animation.stop();
    }
    snapAnimationsRef.current = [];
    isSnapAnimatingRef.current = false;
  }, []);

  const measure = useCallback(() => {
    const el = rootRef.current;
    if (!el) return { width: FALLBACK_SIZE, height: FALLBACK_SIZE };
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width || FALLBACK_SIZE,
      height: rect.height || FALLBACK_SIZE,
    };
  }, []);

  const snapTransition = prefersReducedMotion ? SNAP_SPRING_REDUCED : SNAP_SPRING;

  const commitPosition = useCallback(
    (
      nextSide: FloatingExpandableSide,
      nextTop: number,
      size = measure(),
      persist = false,
      options?: { animate?: boolean },
    ) => {
      const { minY, maxY } = getYBounds(size.height);
      const clampedTop = clamp(nextTop, minY, maxY);
      const snappedLeft = resolveLeft(nextSide, size.width);
      const yRatio = toYRatio(clampedTop, size.height);
      const shouldAnimate = Boolean(options?.animate);

      setSide(nextSide);
      setTop(clampedTop);
      topRef.current = clampedTop;

      if (persist) {
        setStored({ side: nextSide, yRatio });
      }

      stopSnapAnimations();

      if (!shouldAnimate || prefersReducedMotion) {
        leftMv.set(snappedLeft);
        topMv.set(clampedTop);
        setIsLeftAnchored(nextSide === 'left');
        return clampedTop;
      }

      // Animate with left/top so both edges settle smoothly; after snap to
      // the right edge, switch back to `right` anchoring so width grows inward.
      setIsLeftAnchored(true);
      isSnapAnimatingRef.current = true;
      snapAnimationsRef.current = [
        animate(leftMv, snappedLeft, snapTransition),
        animate(topMv, clampedTop, {
          ...snapTransition,
          onComplete: () => {
            isSnapAnimatingRef.current = false;
            setIsLeftAnchored(nextSide === 'left');
            snapAnimationsRef.current = [];
          },
        }),
      ];

      return clampedTop;
    },
    [
      leftMv,
      measure,
      prefersReducedMotion,
      setStored,
      snapTransition,
      stopSnapAnimations,
      topMv,
    ],
  );

  const syncPosition = useCallback(
    (nextSide: FloatingExpandableSide = stored.side, yRatio = stored.yRatio) => {
      // Persist after snap updates `stored` and would re-enter here via
      // useLayoutEffect — don't kill the in-flight spring.
      if (isSnapAnimatingRef.current) {
        setIsReady(true);
        return;
      }

      const size = measure();
      const nextTop = resolveTop(yRatio, size.height);
      commitPosition(nextSide, nextTop, size, false, { animate: false });
      setIsReady(true);
    },
    [commitPosition, measure, stored.side, stored.yRatio],
  );

  /** Keep user's stored yRatio; never rewrite storage on automatic reclamps. */
  const reclampToSide = useCallback(() => {
    if (isSnapAnimatingRef.current || isDragging) {
      return;
    }

    const size = measure();
    const nextTop = resolveTop(stored.yRatio, size.height);
    const nextLeft = resolveLeft(side, size.width);

    stopSnapAnimations();
    setTop(nextTop);
    topRef.current = nextTop;
    leftMv.set(nextLeft);
    topMv.set(nextTop);
    setIsLeftAnchored(side === 'left');
  }, [isDragging, leftMv, measure, side, stopSnapAnimations, stored.yRatio, topMv]);

  reclampToSideRef.current = reclampToSide;

  useLayoutEffect(() => {
    syncPosition();
  }, [syncPosition]);

  useEffect(() => {
    topRef.current = top;
  }, [top]);

  useEffect(() => {
    return () => stopSnapAnimations();
  }, [stopSnapAnimations]);

  useEffect(() => {
    if (authStatus === 'loading') return;

    const frame = window.requestAnimationFrame(() => {
      reclampToSideRef.current();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [authStatus]);

  useEffect(() => {
    const onViewportResize = () => {
      if (isDragging) return;
      reclampToSide();
    };

    // Do NOT listen to visualViewport `scroll` — it fires on normal page scroll
    // (esp. mobile) and makes the badge drift while chrome animates.
    window.addEventListener('resize', onViewportResize);
    window.visualViewport?.addEventListener('resize', onViewportResize);

    return () => {
      window.removeEventListener('resize', onViewportResize);
      window.visualViewport?.removeEventListener('resize', onViewportResize);
    };
  }, [isDragging, reclampToSide]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(
      '[data-app-chrome="header"]',
    );
    const bottomNav = document.querySelector<HTMLElement>(
      '[data-app-chrome="bottom-nav"]',
    );

    if (!header && !bottomNav) return;

    const observer = new ResizeObserver(() => {
      if (isDragging) return;
      reclampToSide();
    });

    if (header) observer.observe(header);
    if (bottomNav) observer.observe(bottomNav);

    return () => observer.disconnect();
  }, [authStatus, isDragging, reclampToSide]);

  const snapAndPersist = useCallback(
    (
      nextLeft: number,
      nextTop: number,
      sizeWidth: number,
      sizeHeight: number,
    ) => {
      const centerX = nextLeft + sizeWidth / 2;
      const nextSide: FloatingExpandableSide =
        centerX < window.innerWidth / 2 ? 'left' : 'right';

      commitPosition(
        nextSide,
        nextTop,
        { width: sizeWidth, height: sizeHeight },
        true,
        { animate: true },
      );
      setIsDragging(false);
    },
    [commitPosition],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;

      const root = rootRef.current;
      if (!root) return;

      stopSnapAnimations();

      const rect = root.getBoundingClientRect();
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originLeft: rect.left,
        originTop: rect.top,
        moved: false,
        width: rect.width,
        height: rect.height,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [stopSnapAnimations],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const state = dragStateRef.current;
      if (!state || state.pointerId !== event.pointerId) return;

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;

      if (!state.moved) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
        state.moved = true;
        // Switch to left anchoring from the current visual rect so a right-docked
        // chip can drag/snap without jumping.
        leftMv.set(state.originLeft);
        topMv.set(state.originTop);
        setIsLeftAnchored(true);
        setIsDragging(true);
      }

      event.preventDefault();

      const { minY, maxY } = getYBounds(state.height);

      leftMv.set(state.originLeft + dx);
      topMv.set(clamp(state.originTop + dy, minY, maxY));
    },
    [leftMv, topMv],
  );

  const isDragFinishedOnPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const state = dragStateRef.current;
      if (!state || state.pointerId !== event.pointerId) return false;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const isDidDrag = state.moved;
      dragStateRef.current = null;

      if (!isDidDrag) {
        setIsDragging(false);
        // Restore edge anchoring if a snap was interrupted without a drag.
        setIsLeftAnchored(side === 'left');
        return false;
      }

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      const { minY, maxY } = getYBounds(state.height);

      snapAndPersist(
        state.originLeft + dx,
        clamp(state.originTop + dy, minY, maxY),
        state.width,
        state.height,
      );
      return true;
    },
    [side, snapAndPersist],
  );

  const style: MotionStyle = isLeftAnchored
    ? {
        left: leftMv,
        right: 'auto',
        top: topMv,
        opacity: isReady ? 1 : 0,
      }
    : {
        // Anchor to the actual edge: changing width must grow inward,
        // not push the right-side badge outside the viewport.
        left: 'auto',
        right: EDGE_MARGIN,
        top: topMv,
        opacity: isReady ? 1 : 0,
      };

  return {
    rootRef,
    side,
    style,
    isDragging,
    isReady,
    onPointerDown,
    onPointerMove,
    onPointerUp: isDragFinishedOnPointerUp,
    onPointerCancel: isDragFinishedOnPointerUp,
    reclampToSide,
  };
};
