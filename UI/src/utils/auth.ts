/**
 * Simple authentication utilities using cookies
 */
import Cookies from "js-cookie";

/**
 * Check if user is logged in by checking for access_token cookie
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  const accessToken = Cookies.get("access_token");
  return !!accessToken;
};

/**
 * Check if user is admin by checking for user_role cookie
 */
export const isAdmin = (): boolean => {
  if (typeof window === "undefined") return false;
  const userRole = Cookies.get("user_role");
  return userRole === "Admin";
};

/**
 * Get user ID from cookies if available
 */
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return Cookies.get("user_id") || null;
};

/**
 * Get user profile data (basic info only)
 */
export const getUserData = () => {
  if (typeof window === "undefined") return null;

  return {
    isLoggedIn: isLoggedIn(),
    isAdmin: isAdmin(),
    userId: getUserId(),
  };
};
