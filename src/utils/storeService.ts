/**
 * Service for managing local storage for authentication tokens and user data
 */
export const StoreService = {
  /**
   * Get the authentication token from localStorage
   * @returns The auth token or null if not found
   */
  getAuthToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Set the authentication token in localStorage
   * @param token The token to store, or null to remove
   */
  setAuthToken: (token: string | null): void => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  /**
   * Get the user info from localStorage
   * @returns The user info object or null if not found
   */
  getUserInfo: (): any | null => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (e) {
        console.error('Error parsing user info from localStorage', e);
        return null;
      }
    }
    return null;
  },

  /**
   * Set the user info in localStorage
   * @param userInfo The user info to store, or null to remove
   */
  setUserInfo: (userInfo: any | null): void => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  },

  /**
   * Clear all authentication data from localStorage
   */
  clearAuthData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }
};
