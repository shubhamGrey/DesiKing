// User utility functions

export const getUserProfile = () => {
  try {
    if (typeof window !== "undefined") {
      const profile = localStorage.getItem("user_profile");
      return profile ? JSON.parse(profile) : null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const setUserProfile = (profile: any) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    }
  } catch (error) {
    console.error("Error setting user profile:", error);
  }
};

export const clearUserProfile = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_profile");
    }
  } catch (error) {
    console.error("Error clearing user profile:", error);
  }
};
