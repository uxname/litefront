import { TFunction } from "i18next";
import * as yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

export const getValidationSchema = (
  t: TFunction,
): yup.ObjectSchema<LoginFormValues> => {
  const MIN_PASSWORD_LENGTH = 6;
  return yup.object({
    email: yup
      .string()
      .email(t("login:invalidEmail"))
      .required(t("login:requiredEmail")),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, t("login:passwordMinLength"))
      .required(t("login:requiredPassword")),
  });
};
