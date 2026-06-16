
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import useAuthStore
from "../store/authStore";

export default function ProtectedRoute({
  children,
}) {
  const location =
    useLocation();

  const token =
    useAuthStore(
      (state) =>
        state.token
    );

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{
          from:
            location.pathname,
        }}
        replace
      />
    );
  }

  return children;
}

