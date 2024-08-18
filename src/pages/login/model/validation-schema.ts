import { TFunction } from "i18next";
import * as yup from "yup";

export interface ILoginFormValues {
  email: string;
  password: string;
}

export const getValidationSchema = (
  t: TFunction,
): yup.ObjectSchema<ILoginFormValues> => {
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
