"use client";

import Image from "next/image";
import {
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { Link } from "@/helpers/i18n/routing";
import { cn } from "@/lib/utils";
import styles from "./product-card-media.module.css";
import type { ProductCardMediaProps } from "./types/i-product-card-media-props";

const SWIPE_THRESHOLD_PX = 36;

function resolveIndexFromClientX(
  clientX: number,
  element: HTMLElement,
  imageCount: number,
): number {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || imageCount <= 1) {
    return 0;
  }

  const ratio = (clientX - rect.left) / rect.width;
  const clamped = Math.min(Math.max(ratio, 0), 0.9999);
  return Math.floor(clamped * imageCount);
}

export function ProductCardMedia({
  href,
  productName,
  images,
}: ProductCardMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToIndex = useCallback(
    (index: number) => {
      setActiveIndex((current) => {
        if (images.length === 0) {
          return 0;
        }
        const next = ((index % images.length) + images.length) % images.length;
        return next === current ? current : next;
      });
    },
    [images.length],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      if (
        event.pointerType !== "mouse" ||
        images.length <= 1 ||
        !rootRef.current
      ) {
        return;
      }

      goToIndex(
        resolveIndexFromClientX(event.clientX, rootRef.current, images.length),
      );
    },
    [goToIndex, images.length],
  );

  const onPointerLeave = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      setActiveIndex(0);
    },
    [],
  );

  const onTouchStart = useCallback((event: TouchEvent<HTMLAnchorElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLAnchorElement>) => {
      const startX = touchStartXRef.current;
      const endX = event.changedTouches[0]?.clientX;
      touchStartXRef.current = null;

      if (startX == null || endX == null || images.length <= 1) {
        return;
      }

      const deltaX = endX - startX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
        return;
      }

      suppressClickRef.current = true;
      goToIndex(activeIndex + (deltaX < 0 ? 1 : -1));
    },
    [activeIndex, goToIndex, images.length],
  );

  const onLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (!suppressClickRef.current) {
      return;
    }
    event.preventDefault();
    suppressClickRef.current = false;
  }, []);

  if (images.length === 0) {
    return (
      <Link href={href} className={styles.root}>
        <div className={styles.empty}>
          <span className={styles.emptyLabel}>{productName}</span>
        </div>
      </Link>
    );
  }

  return (
    <div ref={rootRef} className={styles.root}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            styles.slide,
            index === activeIndex && styles.slideActive,
          )}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            priority={index === 0}
          />
        </div>
      ))}

      {images.length > 1 ? (
        <div className={styles.indicators} aria-hidden>
          {images.map((image, index) => (
            <span
              key={image.id}
              className={cn(
                styles.indicator,
                index === activeIndex && styles.indicatorActive,
              )}
            />
          ))}
        </div>
      ) : null}

      <Link
        href={href}
        className={styles.linkOverlay}
        aria-label={productName}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onLinkClick}
      />
    </div>
  );
}
