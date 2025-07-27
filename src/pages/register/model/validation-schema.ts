import { TFunction } from "i18next";
import { z } from "zod";

export const getValidationSchema = (t: TFunction) =>
  z
    .object({
      email: z.email(t("register:invalidEmail")),
      password: z
        .string()
        .min(6, t("register:passwordMinLength"))
        .min(1, t("register:requiredPassword")),
      passwordConfirmation: z
        .string()
        .min(1, t("register:requiredPasswordConfirmation")),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t("register:passwordsMustMatch"),
      path: ["passwordConfirmation"],
    });

export type IRegisterFormValues = z.infer<
  ReturnType<typeof getValidationSchema>
>;
