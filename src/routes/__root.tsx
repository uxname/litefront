import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import logo from "../../.github/logo.svg";

import styles from "./__root.module.scss";

export const Route = createRootRoute({
  component: () => {
    const isDevelopment = import.meta.env.MODE === "development";

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
        <Outlet />
        {isDevelopment && <TanStackRouterDevtools />}
      </>
    );
  },
});
