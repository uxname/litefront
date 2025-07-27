import { FC } from "react";
import { Controller } from "react-hook-form";
import { useRegisterForm } from "../lib/useRegisterForm";

export const RegisterForm: FC = () => {
  const { t, control, errors, handleSubmit } = useRegisterForm();

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("register:form.title")}
      </h1>

      <div className="form-control w-full">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                id="email"
                type="email"
                placeholder={t("register:form.email")}
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && (
                <label htmlFor="email" className="label">
                  <span className="label-text-alt text-error">
                    {t(errors.email.message as string)}
                  </span>
                </label>
              )}
            </>
          )}
        />
      </div>

      <div className="form-control w-full">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                id="password"
                type="password"
                placeholder={t("register:form.password")}
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && (
                <label htmlFor="password" className="label">
                  <span className="label-text-alt text-error">
                    {t(errors.password.message as string)}
                  </span>
                </label>
              )}
            </>
          )}
        />
      </div>

      <div className="form-control w-full">
        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                id="passwordConfirmation"
                type="password"
                placeholder={t("register:form.confirmPassword")}
                className={`input input-bordered w-full ${errors.passwordConfirmation ? "input-error" : ""}`}
              />
              {errors.passwordConfirmation && (
                <label htmlFor="passwordConfirmation" className="label">
                  <span className="label-text-alt text-error">
                    {t(errors.passwordConfirmation.message as string)}
                  </span>
                </label>
              )}
            </>
          )}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full mt-4">
        {t("register:form.register")}
      </button>
    </form>
  );
};
