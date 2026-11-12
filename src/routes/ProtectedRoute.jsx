import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { clearAllAuthSessions, normalizeRole, getTokenForRole, LOGIN_PATHS } from "../utils/sessionManager";

function ProtectedRoute({ children, role }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const token = getTokenForRole(role);

  const normUserRole = normalizeRole(userRole);
  const normRequiredRole = normalizeRole(role);

  const isRoleMismatch = Boolean(normRequiredRole && normUserRole && normUserRole !== normRequiredRole);
  const isLoggedOut = !token || !userRole;

  // Real-time multi-portal listener:
  // "jab ek system 2 portal open hoga jo portal open tha wo logout ho jana chahiye"
  // When another tab logs in to a different portal role, log out this inactive portal.
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react if "role" in localStorage changed in another tab
      if (e && e.key === "role" && e.newValue) {
        const normNewRole = normalizeRole(e.newValue);
        // If another tab logged into a different portal role:
        if (normNewRole && normRequiredRole && normNewRole !== normRequiredRole) {
          clearAllAuthSessions();
          navigate("/portal-login?logout=true", {
            replace: true,
            state: { message: "You were logged out because another portal was logged into on this device." },
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [role, normRequiredRole, navigate]);

  // If another portal session was previously active when opening this route:
  // "jab ek system 2 portal open hoga jo portal open tha wo logout ho jana chahiye"
  if (isRoleMismatch) {
    clearAllAuthSessions();
    return (
      <Navigate
        to="/portal-login?logout=true"
        replace
        state={{ message: "Previous portal session logged out. Please sign in to continue." }}
      />
    );
  }

  // NOT LOGGED IN → send to unified portal login
  if (isLoggedOut) {
    return <Navigate to="/portal-login" replace />;
  }

  return children;
}

export default ProtectedRoute;
