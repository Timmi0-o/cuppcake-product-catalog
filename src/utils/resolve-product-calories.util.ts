type NutritionalInfoLike = {
  protein: number;
  fats: number;
  carbohydrates: number;
};

/** Atwater factors: protein×4 + fats×9 + carbohydrates×4 */
export const calculateCaloriesFromNutritionalInfo = (
  nutritionalInfo: NutritionalInfoLike,
): number => {
  const protein = Number(nutritionalInfo.protein) || 0;
  const fats = Number(nutritionalInfo.fats) || 0;
  const carbohydrates = Number(nutritionalInfo.carbohydrates) || 0;

  return protein * 4 + fats * 9 + carbohydrates * 4;
};

export const hasNutritionalMacros = (
  nutritionalInfo: NutritionalInfoLike | null | undefined,
): boolean => {
  if (!nutritionalInfo) {
    return false;
  }

  return (
    (Number(nutritionalInfo.protein) || 0) > 0 ||
    (Number(nutritionalInfo.fats) || 0) > 0 ||
    (Number(nutritionalInfo.carbohydrates) || 0) > 0
  );
};

export const parseManualKkalValue = (
  manualKkal: string | number | null | undefined,
): number | null => {
  if (manualKkal === null || manualKkal === undefined) {
    return null;
  }

  const normalized = String(manualKkal).trim();
  if (normalized === "") {
    return null;
  }

  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
};

export type ResolvedProductCalories =
  | { kind: "manual"; value: number }
  | { kind: "calculated"; value: number }
  | { kind: "unavailable" };

export const resolveProductCalories = (input: {
  manualKkal?: string | number | null;
  nutritionalInfo?: NutritionalInfoLike | null;
}): ResolvedProductCalories => {
  const manualValue = parseManualKkalValue(input.manualKkal);
  if (manualValue !== null) {
    return { kind: "manual", value: manualValue };
  }

  if (input.nutritionalInfo && hasNutritionalMacros(input.nutritionalInfo)) {
    return {
      kind: "calculated",
      value: calculateCaloriesFromNutritionalInfo(input.nutritionalInfo),
    };
  }

  return { kind: "unavailable" };
};

export const formatCaloriesValue = (value: number): string => {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(1).replace(/\.0$/, "");
};
