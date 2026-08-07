'use client';

import type { ICategory } from '@/actions/category/models/category.schema';
import type { IMeasurementUnit } from '@/actions/measurement-unit/models/measurement-unit.schema';
import {
  productsCreate,
  productsDelete,
  productsDeleteImages,
  productsUpdate,
  productsUploadImages,
} from '@/actions/product/actions';
import type { IProduct } from '@/actions/product/models/product.schema';
import { Button } from '@/components/shared/ui/button';
import { useRouter } from '@/helpers/i18n/routing';
import { pickImageUrlByVariant } from '@/utils/pick-image-url-by-variant.util';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import styles from './admin-product-form.module.css';

type AdminProductFormProps = {
  mode: 'create' | 'edit';
  product?: IProduct;
  categories: ICategory[];
  measurementUnits: IMeasurementUnit[];
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  note: string;
  price: string;
  manualKkal: string;
  protein: string;
  fats: string;
  carbohydrates: string;
  measurementUnitId: string;
  categoryIds: string[];
};

const toFormState = (
  product: IProduct | undefined,
  measurementUnits: IMeasurementUnit[],
): FormState => ({
  name: product?.name ?? '',
  slug: product?.slug ?? '',
  description: product?.description ?? '',
  note: product?.note ?? '',
  price: product?.price ?? '',
  manualKkal: product?.manualKkal ?? '',
  protein: String(product?.nutritionalInfo.protein ?? 0),
  fats: String(product?.nutritionalInfo.fats ?? 0),
  carbohydrates: String(product?.nutritionalInfo.carbohydrates ?? 0),
  measurementUnitId:
    product?.measurementUnit.id ?? measurementUnits[0]?.id ?? '',
  categoryIds: product?.categories.map((category) => category.id) ?? [],
});

export function AdminProductForm({
  mode,
  product,
  categories,
  measurementUnits,
}: AdminProductFormProps) {
  const t = useTranslations('pages.admin');
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    toFormState(product, measurementUnits),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState(product?.images ?? []);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const toggleCategory = (categoryId: string) => {
    setForm((previous) => {
      const exists = previous.categoryIds.includes(categoryId);
      return {
        ...previous,
        categoryIds: exists
          ? previous.categoryIds.filter((id) => id !== categoryId)
          : [...previous.categoryIds, categoryId],
      };
    });
  };

  const buildPayload = () => {
    const slug = form.slug.trim();
    return {
      name: form.name.trim(),
      ...(slug ? { slug } : {}),
      description: form.description.trim() || null,
      note: form.note.trim() || null,
      price: form.price.trim(),
      manualKkal: form.manualKkal.trim(),
      nutritionalInfo: {
        protein: Number(form.protein),
        fats: Number(form.fats),
        carbohydrates: Number(form.carbohydrates),
      },
      measurementUnitId: form.measurementUnitId,
      categoryIds: form.categoryIds,
      priceVariants: product?.priceVariants ?? null,
    };
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = buildPayload();

      if (mode === 'create') {
        const response = await productsCreate(payload);
        if (response.error || !response.result?.data) {
          setError(response.error?.message ?? t('saveError'));
          return;
        }
        router.push(`/admin/products/${response.result.data.id}`);
        router.refresh();
        return;
      }

      if (!product) {
        setError(t('saveError'));
        return;
      }

      const response = await productsUpdate(product.id, payload);
      if (response.error || !response.result?.data) {
        setError(response.error?.message ?? t('saveError'));
        return;
      }

      router.refresh();
    } catch {
      setError(t('saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(t('deleteConfirm'));
    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);
    try {
      const response = await productsDelete(product.id);
      if (response.error) {
        setError(response.error.message ?? t('deleteError'));
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError(t('deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const onUpload = async (fileList: FileList | null) => {
    if (!product || !fileList || fileList.length === 0) {
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(fileList).forEach((file) => {
        formData.append('files', file);
      });

      const response = await productsUploadImages(product.id, formData);
      if (response.error || !response.result?.data) {
        setError(response.error?.message ?? t('uploadError'));
        return;
      }

      setImages((previous) => [...previous, ...response.result!.data!]);
      router.refresh();
    } catch {
      setError(t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const onDeleteImage = async (fileId: string) => {
    if (!product) {
      return;
    }

    setError(null);
    try {
      const response = await productsDeleteImages(product.id, {
        fileIds: [fileId],
      });
      if (response.error) {
        setError(response.error.message ?? t('deleteImageError'));
        return;
      }
      setImages((previous) =>
        previous.filter((image) => image.fileId !== fileId),
      );
      router.refresh();
    } catch {
      setError(t('deleteImageError'));
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? t('createProductTitle') : t('editProductTitle')}
        </h1>
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-name">
            {t('fieldName')}
          </label>
          <input
            id="product-name"
            className={styles.input}
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-slug">
            {t('fieldSlug')}
          </label>
          <input
            id="product-slug"
            className={styles.input}
            value={form.slug}
            onChange={(event) => updateField('slug', event.target.value)}
            placeholder={t('slugPlaceholder')}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-description">
            {t('fieldDescription')}
          </label>
          <textarea
            id="product-description"
            className={styles.textarea}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-note">
            {t('fieldNote')}
          </label>
          <textarea
            id="product-note"
            className={styles.textarea}
            value={form.note}
            onChange={(event) => updateField('note', event.target.value)}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-price">
              {t('fieldPrice')}
            </label>
            <input
              id="product-price"
              className={styles.input}
              value={form.price}
              onChange={(event) => updateField('price', event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-kkal">
              {t('fieldKkal')}
            </label>
            <input
              id="product-kkal"
              className={styles.input}
              value={form.manualKkal}
              onChange={(event) => updateField('manualKkal', event.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-protein">
              {t('fieldProtein')}
            </label>
            <input
              id="product-protein"
              className={styles.input}
              type="number"
              step="any"
              value={form.protein}
              onChange={(event) => updateField('protein', event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-fats">
              {t('fieldFats')}
            </label>
            <input
              id="product-fats"
              className={styles.input}
              type="number"
              step="any"
              value={form.fats}
              onChange={(event) => updateField('fats', event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-carbs">
              {t('fieldCarbs')}
            </label>
            <input
              id="product-carbs"
              className={styles.input}
              type="number"
              step="any"
              value={form.carbohydrates}
              onChange={(event) =>
                updateField('carbohydrates', event.target.value)
              }
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-unit">
              {t('fieldUnit')}
            </label>
            <select
              id="product-unit"
              className={styles.select}
              value={form.measurementUnitId}
              onChange={(event) =>
                updateField('measurementUnitId', event.target.value)
              }
              required
            >
              <option value="">{t('unitPlaceholder')}</option>
              {measurementUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <p className={styles.label}>{t('fieldCategories')}</p>
          <div className={styles.categories}>
            {categories.map((category) => (
              <label key={category.id} className={styles.categoryRow}>
                <input
                  type="checkbox"
                  checked={form.categoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('saving') : t('save')}
          </Button>
          {mode === 'edit' ? (
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => {
                void onDelete();
              }}
            >
              {isDeleting ? t('deleting') : t('delete')}
            </Button>
          ) : null}
        </div>
      </form>

      {mode === 'edit' && product ? (
        <div className={styles.form}>
          <h2 className={styles.sectionTitle}>{t('imagesTitle')}</h2>
          <div className={styles.uploadRow}>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={(event) => {
                void onUpload(event.target.files);
                event.target.value = '';
              }}
            />
            {isUploading ? <span>{t('uploading')}</span> : null}
          </div>

          {images.length === 0 ? (
            <p>{t('imagesEmpty')}</p>
          ) : (
            <div className={styles.images}>
              {images.map((image) => {
                const src = pickImageUrlByVariant(
                  image.urls,
                  'low',
                  image.fileUrl,
                );
                return (
                  <div key={image.id} className={styles.imageCard}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.thumb}
                      src={src}
                      alt={image.originalName}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        void onDeleteImage(image.fileId);
                      }}
                    >
                      {t('deleteImage')}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
