import { m } from "@generated/paraglide/messages";
import { z } from "zod";

/**
 * Frontend profile form schema. The limits mirror the backend's, which is the
 * authority on what it will persist: `ProfileDisplayNameMaxLen`,
 * `ProfileBioMaxLen` and `ProfileAvatarURLMaxLen` in
 * `backend/internal/config/constants.go` (Go constants — the backend has no zod).
 * Keep the numbers here, the ones in `validation_*` messages, and those constants
 * in step; they had already drifted to 80/500 against the backend's 100/1000.
 * Empty strings are allowed in the form (they mean "leave unchanged" and are
 * dropped on submit).
 */
export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(100, { message: m.validation_display_name_length() })
    .optional(),
  bio: z
    .string()
    .trim()
    .max(1000, { message: m.validation_bio_length() })
    .optional(),
  avatarUrl: z
    .union([
      z.literal(""),
      z.url({ message: m.validation_invalid_url() }).max(2048),
    ])
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
