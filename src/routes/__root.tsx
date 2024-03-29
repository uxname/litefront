import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import styles from "./__root.module.scss";

export const Route = createRootRoute({
  component: () => {
    const isDevelopment = import.meta.env.MODE === "development";

    return (
      <>
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
