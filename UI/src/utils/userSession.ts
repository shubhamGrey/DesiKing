// User session management utilities

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  mobileNumber: string;
  roleId: string;
  roleName: string;
  createdDate: string;
  modifiedDate: string;
  brandId: string;
  isActive: boolean;
}

export interface RoleDetails {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdDate: string;
  modifiedDate: string;
}

export class UserSessionManager {
  private static readonly USER_PROFILE_KEY = "user_profile";

  /**
   * Store user profile in sessionStorage
   */
  static setUserProfile(userProfile: UserProfile): void {
    try {
      // Check if we're in a browser environment
      if (
        typeof window === "undefined" ||
        typeof sessionStorage === "undefined"
      ) {
        return;
      }

      sessionStorage.setItem(
        this.USER_PROFILE_KEY,
        JSON.stringify(userProfile)
      );
      console.log("User profile stored in session:", userProfile);
    } catch (error) {
      console.error("Error storing user profile:", error);
    }
  }

  /**
   * Get user profile from sessionStorage
   */
  static getUserProfile(): UserProfile | null {
    try {
      // Check if we're in a browser environment
      if (
        typeof window === "undefined" ||
        typeof sessionStorage === "undefined"
      ) {
        return null;
      }

      const profileData = sessionStorage.getItem(this.USER_PROFILE_KEY);
      if (profileData) {
        return JSON.parse(profileData) as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      return null;
    }
  }

  /**
   * Remove user profile from sessionStorage
   */
  static clearUserProfile(): void {
    try {
      // Check if we're in a browser environment
      if (
        typeof window === "undefined" ||
        typeof sessionStorage === "undefined"
      ) {
        return;
      }

      sessionStorage.removeItem(this.USER_PROFILE_KEY);
      console.log("User profile cleared from session");
    } catch (error) {
      console.error("Error clearing user profile:", error);
    }
  }

  /**
   * Check if user is logged in (has profile in session)
   */
  static isLoggedIn(): boolean {
    return this.getUserProfile() !== null;
  }

  /**
   * Get user role from session
   */
  static getUserRole(): string | null {
    const profile = this.getUserProfile();
    return profile?.roleName ?? null;
  }

  /**
   * Check if user has admin role
   */
  static isAdmin(): boolean {
    const role = this.getUserRole();
    return role === "Admin";
  }

  /**
   * Get user full name
   */
  static getUserFullName(): string {
    const profile = this.getUserProfile();
    if (profile) {
      return `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
    }
    return "";
  }

  /**
   * Get user email
   */
  static getUserEmail(): string | null {
    const profile = this.getUserProfile();
    return profile?.email ?? null;
  }

  /**
   * Update specific fields in user profile
   */
  static updateUserProfile(updates: Partial<UserProfile>): void {
    const currentProfile = this.getUserProfile();
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      this.setUserProfile(updatedProfile);
    }
  }
}

import { useCallback } from "react";

//

/**
 * Hook for using user session data in React components
 */
export function useUserSession() {
  const getUserProfile = useCallback(
    () => UserSessionManager.getUserProfile(),
    []
  );
  const setUserProfile = useCallback(
    (profile: UserProfile) => UserSessionManager.setUserProfile(profile),
    []
  );
  const clearUserProfile = useCallback(
    () => UserSessionManager.clearUserProfile(),
    []
  );
  const isLoggedIn = useCallback(() => UserSessionManager.isLoggedIn(), []);
  const getUserRole = useCallback(() => UserSessionManager.getUserRole(), []);
  const isAdmin = useCallback(() => UserSessionManager.isAdmin(), []);
  const getUserFullName = useCallback(
    () => UserSessionManager.getUserFullName(),
    []
  );
  const getUserEmail = useCallback(() => UserSessionManager.getUserEmail(), []);

  return {
    getUserProfile,
    setUserProfile,
    clearUserProfile,
    isLoggedIn,
    getUserRole,
    isAdmin,
    getUserFullName,
    getUserEmail,
  };
}
