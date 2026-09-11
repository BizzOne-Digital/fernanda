import { z } from "zod";
import { imageRefSchema, seoSchema } from "./common";

export const adminImageRefSchema = imageRefSchema.nullable().optional();
export const adminSeoSchema = seoSchema.optional();
export const adminImageArraySchema = z.array(imageRefSchema).optional();

export type AdminImageRef = z.infer<typeof imageRefSchema>;
export type AdminImageRefInput = z.infer<typeof adminImageRefSchema>;
export type AdminSeoInput = z.infer<typeof adminSeoSchema>;
