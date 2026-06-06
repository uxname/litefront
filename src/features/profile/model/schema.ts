import { m } from "@generated/paraglide/messages";
import { z } from "zod";

/**
 * Frontend profile form schema — mirrors the backend `ProfileUpdateInput` zod
 * rules (displayName 1–80, bio ≤500, avatarUrl valid URL ≤2048). Empty strings
 * are allowed in the form (they mean "leave unchanged" and are dropped on submit).
 */
export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(80, { message: m.validation_display_name_length() })
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, { message: m.validation_bio_length() })
    .optional(),
  avatarUrl: z
    .union([
      z.literal(""),
      z.url({ message: m.validation_invalid_url() }).max(2048),
    ])
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
