import { type ZodObject, type ZodSchema, z } from 'zod';

export const sanitizeQueryFiltersBySchema = <TFilters>(
  schema: ZodSchema<TFilters> | undefined,
  filters: TFilters,
): TFilters => {
  if (!schema) {
    return filters;
  }

  if (!(schema instanceof z.ZodObject)) {
    const parsed = schema.safeParse(filters);
    return parsed.success ? parsed.data : ({} as TFilters);
  }

  const shape = (schema as ZodObject<Record<string, ZodSchema>>).shape;
  const input = filters as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(input)) {
    if (!(key in shape)) {
      continue;
    }

    const fieldSchema = shape[key as keyof typeof shape] as ZodSchema;
    const parsed = fieldSchema.safeParse(input[key]);

    if (parsed.success) {
      result[key] = parsed.data;
    }
  }

  return result as TFilters;
};
