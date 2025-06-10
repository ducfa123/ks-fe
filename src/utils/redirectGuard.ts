/**
 * Check if the current path should be protected from redirects
 * @param pathname Current path
 * @returns Whether the path should be protected from auth redirects
 */
export const isRedirectProtectedPath = (pathname: string): boolean => {
  // Survey pages should never redirect regardless of auth status
  if (pathname.includes('/khao-sat/')) {
    return true;
  }
  
  // Add other paths that should be accessible without login
  const publicPaths = [
    '/dang-nhap',
    '/dang-ky',
    '/quen-mat-khau',
    '/trang-chu',
    '/'
  ];
  
  return publicPaths.some(path => pathname === path);
};

/**
 * Check if a redirect to login is needed
 * @param pathname Current path
 * @param isAuthenticated Whether the user is authenticated
 * @returns Whether to redirect to login
 */
export const shouldRedirectToLogin = (pathname: string, isAuthenticated: boolean): boolean => {
  // If user is authenticated, no need to redirect
  if (isAuthenticated) return false;
  
  // If path is protected from redirects, don't redirect
  if (isRedirectProtectedPath(pathname)) return false;
  
  // Otherwise, redirect to login
  return true;
};
