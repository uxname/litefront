import { FC, useId } from "react";
import { Controller } from "react-hook-form";
import { useLoginForm } from "../lib/useLoginForm";

export const LoginForm: FC = () => {
  const { t, control, errors, handleSubmit } = useLoginForm();
  const emailId = useId();
  const passwordId = useId();

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        {t("login:form.title")}
      </h1>

      <div className="form-control w-full">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                id={emailId}
                type="email"
                placeholder={t("login:form.email")}
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
                id={passwordId}
                type="password"
                placeholder={t("login:form.password")}
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

      <button type="submit" className="btn btn-primary w-full mt-4">
        {t("login:form.login")}
      </button>
    </form>
  );
};
