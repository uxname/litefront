import type { FC } from "react";

import styles from "./index.module.scss";

export const RegisterPage: FC = () => {
  return (
    <>
      <div className={styles.container}>
        <input type="text" placeholder="Login" />
        <input type="password" placeholder="Password" />
        <button>Register</button>
      </div>
    </>
  );
};
