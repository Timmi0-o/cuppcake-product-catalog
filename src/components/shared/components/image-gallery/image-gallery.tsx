"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, FreeMode, Keyboard, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import styles from "./image-gallery.module.css";
import type { ImageGalleryProps } from "./types/i-image-gallery-props";

export function ImageGallery({
  images,
  emptyLabel,
  className,
}: ImageGalleryProps) {
  const t = useTranslations("components.image-gallery");
  const labelId = useId();
  const [mainSwiper, setMainSwiper] = useState<SwiperInstance | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);
  const [lightboxSwiper, setLightboxSwiper] = useState<SwiperInstance | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    mainSwiper?.slideTo(activeIndex);
  }, [activeIndex, mainSwiper]);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className={cn(styles.empty, className)}>
        <span className={styles.emptyLabel}>{emptyLabel ?? "—"}</span>
      </div>
    );
  }

  const showThumbs = images.length > 1;
  const activeImage = images[activeIndex] ?? images[0];
  const fallbackAlt = emptyLabel ?? "";

  const lightbox =
    mounted && lightboxOpen
      ? createPortal(
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
          >
            <div className={styles.lightboxToolbar}>
              <p id={labelId} className={styles.lightboxCounter}>
                {activeIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={closeLightbox}
                aria-label={t("closeFullscreen")}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.lightboxStage}>
              {showThumbs ? (
                <>
                  <button
                    type="button"
                    className={cn(
                      styles.navButton,
                      styles.navPrev,
                      styles.lightboxNav,
                    )}
                    aria-label={t("previousImage")}
                    onClick={() => lightboxSwiper?.slidePrev()}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className={cn(
                      styles.navButton,
                      styles.navNext,
                      styles.lightboxNav,
                    )}
                    aria-label={t("nextImage")}
                    onClick={() => lightboxSwiper?.slideNext()}
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              ) : null}
              <Swiper
                className={styles.lightboxSwiper}
                modules={[Keyboard, A11y]}
                onSwiper={setLightboxSwiper}
                initialSlide={activeIndex}
                keyboard={{ enabled: true }}
                spaceBetween={16}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={image.id} className={styles.lightboxSlide}>
                    <div className={styles.lightboxImageWrap}>
                      <Image
                        src={image.fullscreenSrc ?? image.src}
                        alt={image.alt ?? `${fallbackAlt} ${index + 1}`.trim()}
                        fill
                        sizes="100vw"
                        className={styles.lightboxImage}
                        priority={index === activeIndex}
                        unoptimized
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={cn(styles.gallery, className)}>
      <div className={styles.mainFrame}>
        {showThumbs ? (
          <>
            <button
              type="button"
              className={cn(styles.navButton, styles.navPrev)}
              aria-label={t("previousImage")}
              onClick={() => mainSwiper?.slidePrev()}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className={cn(styles.navButton, styles.navNext)}
              aria-label={t("nextImage")}
              onClick={() => mainSwiper?.slideNext()}
            >
              <ChevronRight size={22} />
            </button>
          </>
        ) : null}
        <Swiper
          className={styles.mainSwiper}
          modules={[Thumbs, Keyboard, A11y]}
          onSwiper={setMainSwiper}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          keyboard={{ enabled: true }}
          spaceBetween={0}
          autoHeight={false}
          watchOverflow
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} className={styles.mainSlide}>
              <button
                type="button"
                className={styles.slideButton}
                onClick={() => openLightbox(index)}
                aria-label={t("openFullscreen")}
                onKeyDown={(event: ReactKeyboardEvent<HTMLButtonElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(index);
                  }
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt ?? activeImage?.alt ?? fallbackAlt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.slideImage}
                  unoptimized
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showThumbs ? (
        <Swiper
          className={styles.thumbsSwiper}
          modules={[Thumbs, FreeMode, A11y]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4.2}
          freeMode
          watchSlidesProgress
          watchOverflow
          breakpoints={{
            480: { slidesPerView: 5.2 },
            768: { slidesPerView: 6 },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} className={styles.thumbSlide}>
              <button
                type="button"
                className={cn(
                  styles.thumbButton,
                  index === activeIndex && styles.thumbButtonActive,
                )}
                aria-label={t("goToImage", { index: index + 1 })}
                onClick={() => mainSwiper?.slideTo(index)}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="72px"
                  className={styles.slideImage}
                  unoptimized
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}

      {lightbox}
    </div>
  );
}
