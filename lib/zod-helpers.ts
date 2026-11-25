import { z } from "zod";

/** Treats an empty-string form field as absent instead of failing type coercion (e.g. "" -> NaN/0/invalid date). */
export function optionalField<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((value) => (value === "" ? undefined : value), schema.optional());
}
