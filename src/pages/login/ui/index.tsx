import { FC } from "react";

import styles from "./index.module.scss";

export const LoginPage: FC = () => {
  return (
    <div className={styles.container}>
      <div>
        <input type="text" placeholder="Login" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
};
