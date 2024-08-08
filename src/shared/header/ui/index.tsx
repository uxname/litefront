import { FC } from "react";
import { Link } from "@tanstack/react-router";

import logo from "../../../../.github/logo.svg";

import styles from "./index.module.scss";

export const Header: FC = () => {
  return (
    <>
      <img src={logo} alt="logo" className={styles.logo} />
      <div className={styles.header}>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
    </>
  );
};
