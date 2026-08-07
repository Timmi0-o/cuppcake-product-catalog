'use client';

import { m } from 'framer-motion';
import {
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import styles from './floating-expandable.module.css';
import {
  type FloatingExpandableStoredPosition,
  useFloatingExpandablePosition,
} from './hooks/use-floating-expandable-position';

export type FloatingExpandableDragHandlers = {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
  onClick: () => void;
};

export type FloatingExpandableSlotProps = {
  dragHandlers: FloatingExpandableDragHandlers;
  isExpanded: boolean;
  isDragging: boolean;
  collapse: () => void;
  expand: () => void;
  toggle: () => void;
};

type FloatingExpandableSlot =
  | ReactNode
  | ((props: FloatingExpandableSlotProps) => ReactNode);

interface IFloatingExpandableProps {
  /** Compact (collapsed) view — attach `dragHandlers` to the drag/toggle surface */
  compact: FloatingExpandableSlot;
  /** Expanded view — attach `dragHandlers` to the collapse/drag surface */
  children: FloatingExpandableSlot;
  /** localStorage key for persisted edge position */
  storageKey: string;
  defaultPosition?: FloatingExpandableStoredPosition;
  /** Skip outside-click collapse (e.g. while a nested dialog is open) */
  suppressOutsideClose?: boolean;
  /** Perimeter highlight animation while collapsed */
  attract?: boolean;
  /** Accent for attract ring / `--float-accent` (e.g. status color) */
  accentColor?: string;
  className?: string;
  collapsedWidth?: string;
  expandedWidth?: string;
}

const resolveSlot = (
  slot: FloatingExpandableSlot,
  props: FloatingExpandableSlotProps,
): ReactNode => (typeof slot === 'function' ? slot(props) : slot);

export const FloatingExpandable = ({
  compact,
  children,
  storageKey,
  defaultPosition,
  suppressOutsideClose = false,
  attract = true,
  accentColor,
  className,
  collapsedWidth,
  expandedWidth,
}: IFloatingExpandableProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSuppressClickRef = useRef(false);

  const {
    rootRef,
    side,
    style,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: isPointerDragFinished,
    reclampToSide,
  } = useFloatingExpandablePosition({ storageKey, defaultPosition });

  const reclampToSideRef = useRef(reclampToSide);
  reclampToSideRef.current = reclampToSide;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      reclampToSideRef.current();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded || suppressOutsideClose) return;

    const onPointerDownOutside = (event: PointerEvent) => {
      const root = rootRef.current;
      const target = event.target;
      if (!(target instanceof Node) || !root) return;
      if (root.contains(target)) return;
      setIsExpanded(false);
    };

    document.addEventListener('pointerdown', onPointerDownOutside);
    return () => {
      document.removeEventListener('pointerdown', onPointerDownOutside);
    };
  }, [isExpanded, suppressOutsideClose, rootRef]);

  const finishDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const isDidDrag = isPointerDragFinished(event);
    if (isDidDrag) {
      isSuppressClickRef.current = true;
    }
  };

  const toggle = () => {
    if (isSuppressClickRef.current) {
      isSuppressClickRef.current = false;
      return;
    }
    setIsExpanded((isPrev) => !isPrev);
  };

  const collapse = () => setIsExpanded(false);
  const expand = () => setIsExpanded(true);

  const dragHandlers: FloatingExpandableDragHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp: finishDrag,
    onPointerCancel: finishDrag,
    onClick: toggle,
  };

  const slotProps: FloatingExpandableSlotProps = {
    dragHandlers,
    isExpanded,
    isDragging,
    collapse,
    expand,
    toggle,
  };

  const sizeStyle = {
    ...(collapsedWidth ? { '--float-collapsed-width': collapsedWidth } : {}),
    ...(expandedWidth ? { '--float-expanded-width': expandedWidth } : {}),
    ...(accentColor
      ? {
          '--float-accent': accentColor,
          '--attract-color-start': `color-mix(in srgb, ${accentColor} 22%, transparent)`,
          '--attract-color-mid': accentColor,
          '--attract-color-end': `color-mix(in srgb, ${accentColor} 30%, transparent)`,
        }
      : {}),
  } as CSSProperties;

  return (
    <m.div
      ref={rootRef}
      className={cn(
        styles.root,
        side === 'left' ? styles.rootLeft : styles.rootRight,
        isDragging && styles.rootDragging,
        className,
      )}
      style={{ ...style, ...sizeStyle }}
    >
      <div
        className={cn(
          styles.shell,
          'border border-border bg-card shadow-[0_12px_40px_rgb(0_0_0_/0.12)]',
          isExpanded ? styles.shellExpanded : styles.shellCollapsed,
          !isExpanded && !isDragging && attract && styles.shellAttract,
        )}
      >
        {isExpanded ? (
          <div className={styles.expandedContent}>
            {resolveSlot(children, slotProps)}
          </div>
        ) : (
          resolveSlot(compact, slotProps)
        )}
      </div>
    </m.div>
  );
};
