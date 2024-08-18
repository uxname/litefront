import { TFunction } from "i18next";
import * as yup from "yup";

export interface IRegisterFormValues {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const getValidationSchema = (
  t: TFunction,
): yup.ObjectSchema<IRegisterFormValues> => {
  const MIN_PASSWORD_LENGTH = 6;
  return yup.object({
    email: yup
      .string()
      .email(t("register:invalidEmail"))
      .required(t("register:requiredEmail")),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, t("register:passwordMinLength"))
      .required(t("register:requiredPassword")),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), undefined], t("register:passwordsMustMatch"))
      .required(t("register:requiredPasswordConfirmation")),
  });
};
