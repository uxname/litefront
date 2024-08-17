import React, { FC } from "react";

import styles from "./index.module.scss";

interface PageWrapperProperties {
  children: React.ReactNode;
}

export const PageWrapper: FC<PageWrapperProperties> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
