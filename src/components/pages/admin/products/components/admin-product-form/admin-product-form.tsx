"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, useMemo, useState } from "react";
import type { ICategory } from "@/actions/category/models/category.schema";
import type { IMeasurementUnit } from "@/actions/measurement-unit/models/measurement-unit.schema";
import {
  productsCreate,
  productsDelete,
  productsDeleteImages,
  productsUpdate,
  productsUploadImages,
} from "@/actions/product/actions";
import type { IProduct } from "@/actions/product/models/product.schema";
import { Button } from "@/components/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui/card";
import { Checkbox } from "@/components/shared/ui/checkbox";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { Select } from "@/components/shared/ui/select";
import { Separator } from "@/components/shared/ui/separator";
import { Textarea } from "@/components/shared/ui/textarea";
import { useRouter } from "@/helpers/i18n/routing";
import { pickImageUrlByVariant } from "@/utils/pick-image-url-by-variant.util";
import {
  formatCaloriesValue,
  resolveProductCalories,
} from "@/utils/resolve-product-calories.util";
import styles from "./admin-product-form.module.css";

type AdminProductFormProps = {
  mode: "create" | "edit";
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
  name: product?.name ?? "",
  slug: product?.slug ?? "",
  description: product?.description ?? "",
  note: product?.note ?? "",
  price: product?.price ?? "",
  manualKkal: product?.manualKkal ?? "",
  protein: String(product?.nutritionalInfo.protein ?? ""),
  fats: String(product?.nutritionalInfo.fats ?? ""),
  carbohydrates: String(product?.nutritionalInfo.carbohydrates ?? ""),
  measurementUnitId:
    product?.measurementUnit.id ?? measurementUnits[0]?.id ?? "",
  categoryIds: product?.categories.map((category) => category.id) ?? [],
});

export function AdminProductForm({
  mode,
  product,
  categories,
  measurementUnits,
}: AdminProductFormProps) {
  const t = useTranslations("pages.admin");
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

  const nutritionalInfo = useMemo(
    () => ({
      protein: Number(form.protein) || 0,
      fats: Number(form.fats) || 0,
      carbohydrates: Number(form.carbohydrates) || 0,
    }),
    [form.carbohydrates, form.fats, form.protein],
  );

  const caloriesPreview = useMemo(
    () =>
      resolveProductCalories({
        manualKkal: form.manualKkal.trim() || null,
        nutritionalInfo,
      }),
    [form.manualKkal, nutritionalInfo],
  );

  const buildPayload = () => {
    const slug = form.slug.trim();
    const manualKkal = form.manualKkal.trim();
    return {
      name: form.name.trim(),
      ...(slug ? { slug } : {}),
      description: form.description.trim() || null,
      note: form.note.trim() || null,
      price: form.price.trim(),
      manualKkal: manualKkal === "" ? null : manualKkal,
      nutritionalInfo,
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

      if (mode === "create") {
        const response = await productsCreate(payload);
        if (response.error || !response.result?.data) {
          setError(response.error?.message ?? t("saveError"));
          return;
        }
        router.push(`/admin/products/${response.result.data.id}`);
        router.refresh();
        return;
      }

      if (!product) {
        setError(t("saveError"));
        return;
      }

      const response = await productsUpdate(product.id, payload);
      if (response.error || !response.result?.data) {
        setError(response.error?.message ?? t("saveError"));
        return;
      }

      router.refresh();
    } catch {
      setError(t("saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);
    try {
      const response = await productsDelete(product.id);
      if (response.error) {
        setError(response.error.message ?? t("deleteError"));
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError(t("deleteError"));
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
        formData.append("files", file);
      });

      const response = await productsUploadImages(product.id, formData);
      if (response.error || !response.result?.data) {
        setError(response.error?.message ?? t("uploadError"));
        return;
      }

      const uploaded = response.result.data;
      if (uploaded) {
        setImages((previous) => [...previous, ...uploaded]);
      }
      router.refresh();
    } catch {
      setError(t("uploadError"));
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
        setError(response.error.message ?? t("deleteImageError"));
        return;
      }
      setImages((previous) =>
        previous.filter((image) => image.fileId !== fileId),
      );
      router.refresh();
    } catch {
      setError(t("deleteImageError"));
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {mode === "create" ? t("createProductTitle") : t("editProductTitle")}
        </h1>
      </div>

      <form className={styles.stack} onSubmit={onSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>{t("sectionBasicsTitle")}</CardTitle>
            <CardDescription>{t("sectionBasicsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className={styles.sectionBody}>
            <div className={styles.field}>
              <Label htmlFor="product-name">{t("fieldName")}</Label>
              <Input
                id="product-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="product-slug">{t("fieldSlug")}</Label>
              <Input
                id="product-slug"
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder={t("slugPlaceholder")}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="product-description">
                {t("fieldDescription")}
              </Label>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="product-note">{t("fieldNote")}</Label>
              <Textarea
                id="product-note"
                value={form.note}
                onChange={(event) => updateField("note", event.target.value)}
              />
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <Label htmlFor="product-price">{t("fieldPrice")}</Label>
                <Input
                  id="product-price"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="product-unit">{t("fieldUnit")}</Label>
                <Select
                  value={form.measurementUnitId || null}
                  onValueChange={(value) => {
                    if (value) {
                      updateField("measurementUnitId", String(value));
                    }
                  }}
                >
                  <Select.Trigger id="product-unit" className="w-full">
                    <Select.Value placeholder={t("unitPlaceholder")} />
                  </Select.Trigger>
                  <Select.Content>
                    {measurementUnits.map((unit) => (
                      <Select.Item key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sectionNutritionTitle")}</CardTitle>
            <CardDescription>
              {t("sectionNutritionDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.sectionBody}>
            <div className={styles.field}>
              <Label htmlFor="product-kkal">{t("fieldKkal")}</Label>
              <Input
                id="product-kkal"
                inputMode="decimal"
                value={form.manualKkal}
                onChange={(event) =>
                  updateField("manualKkal", event.target.value)
                }
                placeholder={t("kkalPlaceholder")}
              />
              <p className={styles.hint}>{t("kkalHint")}</p>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <Label htmlFor="product-protein">{t("fieldProtein")}</Label>
                <Input
                  id="product-protein"
                  type="number"
                  step="any"
                  value={form.protein}
                  onChange={(event) =>
                    updateField("protein", event.target.value)
                  }
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="product-fats">{t("fieldFats")}</Label>
                <Input
                  id="product-fats"
                  type="number"
                  step="any"
                  value={form.fats}
                  onChange={(event) => updateField("fats", event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="product-carbs">{t("fieldCarbs")}</Label>
                <Input
                  id="product-carbs"
                  type="number"
                  step="any"
                  value={form.carbohydrates}
                  onChange={(event) =>
                    updateField("carbohydrates", event.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.preview} aria-live="polite">
              <span className={styles.hint}>{t("caloriesPreviewLabel")}</span>
              {caloriesPreview.kind === "unavailable" ? (
                <span>{t("caloriesUnavailable")}</span>
              ) : (
                <>
                  <span className={styles.previewValue}>
                    {formatCaloriesValue(caloriesPreview.value)}
                  </span>
                  <span className={styles.hint}>
                    {caloriesPreview.kind === "manual"
                      ? t("caloriesPreviewManual")
                      : t("caloriesPreviewCalculated")}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("sectionCategoriesTitle")}</CardTitle>
            <CardDescription>
              {t("sectionCategoriesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.categories}>
              {categories.map((category) => {
                const checkboxId = `category-${category.id}`;
                return (
                  <div key={category.id} className={styles.categoryRow}>
                    <Checkbox
                      id={checkboxId}
                      checked={form.categoryIds.includes(category.id)}
                      onCheckedChange={(checked) => {
                        const isChecked = Boolean(checked);
                        const isSelected = form.categoryIds.includes(
                          category.id,
                        );
                        if (isChecked !== isSelected) {
                          toggleCategory(category.id);
                        }
                      }}
                    />
                    <Label htmlFor={checkboxId} className="font-normal">
                      {category.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("save")}
          </Button>
          {mode === "edit" ? (
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => {
                void onDelete();
              }}
            >
              {isDeleting ? t("deleting") : t("delete")}
            </Button>
          ) : null}
        </div>
      </form>

      {mode === "edit" && product ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("imagesTitle")}</CardTitle>
            <CardDescription>{t("imagesSectionDescription")}</CardDescription>
          </CardHeader>
          <CardContent className={styles.sectionBody}>
            <div className={styles.uploadRow}>
              <Input
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                className="rounded-2xl file:mr-3"
                onChange={(event) => {
                  void onUpload(event.target.files);
                  event.target.value = "";
                }}
              />
              {isUploading ? (
                <span className={styles.hint}>{t("uploading")}</span>
              ) : null}
            </div>

            <Separator />

            {images.length === 0 ? (
              <p className={styles.hint}>{t("imagesEmpty")}</p>
            ) : (
              <div className={styles.images}>
                {images.map((image) => {
                  const src = pickImageUrlByVariant(
                    image.urls,
                    "low",
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
                        {t("deleteImage")}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
