import { z } from 'zod';

export const MeasurementUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export type IMeasurementUnit = z.infer<typeof MeasurementUnitSchema>;
