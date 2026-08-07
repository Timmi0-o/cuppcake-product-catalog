"use client";

import Image from "next/image";
import {
  type PointerEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "@/helpers/i18n/routing";
import { useMatchMedia } from "@/hooks/use-match-media";
import { cn } from "@/lib/utils";
import "swiper/css";
import styles from "./product-card-media.module.css";
import type { ProductCardMediaProps } from "./types/i-product-card-media-props";

const FINE_POINTER_HOVER_QUERY = "(hover: hover) and (pointer: fine)";

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

function ProductCardMediaIndicators({
  images,
  activeIndex,
}: {
  images: ProductCardMediaProps["images"];
  activeIndex: number;
}) {
  if (images.length <= 1) {
    return null;
  }

  return (
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
  );
}

function ProductCardMediaHover({
  href,
  productName,
  images,
}: ProductCardMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
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
            unoptimized
          />
        </div>
      ))}

      <ProductCardMediaIndicators images={images} activeIndex={activeIndex} />

      <Link
        href={href}
        className={styles.linkOverlay}
        aria-label={productName}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      />
    </div>
  );
}

function ProductCardMediaSwiper({
  href,
  productName,
  images,
}: ProductCardMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onSlideChange = useCallback((swiper: SwiperInstance) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  return (
    <div className={styles.root}>
      <Swiper
        className={styles.swiper}
        modules={[A11y]}
        slidesPerView={1}
        speed={280}
        resistanceRatio={0.75}
        onSlideChange={onSlideChange}
        a11y={{
          enabled: true,
          prevSlideMessage: productName,
          nextSlideMessage: productName,
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id} className={styles.swiperSlide}>
            <Link
              href={href}
              className={styles.slideLink}
              aria-label={productName}
              tabIndex={index === activeIndex ? 0 : -1}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.image}
                priority={index === 0}
                unoptimized
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <ProductCardMediaIndicators images={images} activeIndex={activeIndex} />
    </div>
  );
}

export function ProductCardMedia({
  href,
  productName,
  images,
}: ProductCardMediaProps) {
  const prefersHoverGallery = useMatchMedia(FINE_POINTER_HOVER_QUERY);

  if (images.length === 0) {
    return (
      <Link href={href} className={styles.root}>
        <div className={styles.empty}>
          <span className={styles.emptyLabel}>{productName}</span>
        </div>
      </Link>
    );
  }

  if (images.length === 1) {
    return (
      <Link href={href} className={styles.root} aria-label={productName}>
        <div className={cn(styles.slide, styles.slideActive)}>
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            priority
            unoptimized
          />
        </div>
      </Link>
    );
  }

  // Until media query resolves, prefer Swiper (mobile-safe; avoids hover zones on touch).
  if (prefersHoverGallery === true) {
    return (
      <ProductCardMediaHover
        href={href}
        productName={productName}
        images={images}
      />
    );
  }

  return (
    <ProductCardMediaSwiper
      href={href}
      productName={productName}
      images={images}
    />
  );
}
