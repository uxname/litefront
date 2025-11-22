import { Header } from "@widgets/Header";
import type { FC } from "react";
import { useAuth } from "react-oidc-context";

export const ProtectedPage: FC = () => {
  const auth = useAuth();

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 mt-8">
        <div className="card bg-base-200 shadow-xl max-w-2xl mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">🔐 Protected Route</h2>
            <p className="mb-4">
              If you can see this page, you are successfully authenticated via
              OIDC.
            </p>

            <div className="divider">User Data from Token</div>

            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Email</th>
                    <td>{auth.user?.profile.email}</td>
                  </tr>
                  <tr>
                    <th>ID (Sub)</th>
                    <td className="font-mono text-xs">
                      {auth.user?.profile.sub}
                    </td>
                  </tr>
                  <tr>
                    <th>Expires In</th>
                    <td>{auth.user?.expires_in} seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => void auth.removeUser()}
                className="btn btn-error btn-sm"
              >
                Force Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
