import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/hook";
import type { Role } from "@/shared/config/roles";

type ProtectedRouteProps = {
  children: ReactNode;
  requireRole?: Role;
  requireAgeVerification?: boolean;
};

/**
 * ProtectedRoute wrapper that ensures:
 * 1. User is authenticated
 * 2. User has required role (if specified)
 * 3. User has verified age (if required)
 *
 * Redirects to landing page if not authenticated.
 */
export const ProtectedRoute = ({
  children,
  requireRole,
  requireAgeVerification = true,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Not authenticated - redirect to home
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    // Check age verification
    if (requireAgeVerification && !user.ageVerified) {
      // Age verification modal will be shown by App.tsx
      return;
    }

    // Check role requirement
    if (requireRole && user.role !== requireRole) {
      // Redirect based on user's actual role
      if (user.role === "customer") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(`/dashboard/${user.role}`, { replace: true });
      }
      return;
    }
  }, [user, loading, requireRole, requireAgeVerification, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Age verification required but not completed
  if (requireAgeVerification && !user.ageVerified) {
    return null; // Modal will be shown by App.tsx
  }

  // Role mismatch
  if (requireRole && user.role !== requireRole) {
    return null;
  }

  // All checks passed
  return <>{children}</>;
};

export default ProtectedRoute;
