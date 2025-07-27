import { TFunction } from "i18next";
import { z } from "zod";

export const getValidationSchema = (t: TFunction) =>
  z.object({
    email: z.email(t("login:invalidEmail")),
    password: z
      .string()
      .min(6, t("login:passwordMinLength"))
      .min(1, t("login:requiredPassword")),
  });

export type ILoginFormValues = z.infer<ReturnType<typeof getValidationSchema>>;
