/**
 * File: csrf.ts
 * Purpose: All client side CSRF related functionality
 */


/**
 * When recieving the csrf token, store it in sessionStorage
 * 
 * @param res Fetch Response
 */
export function setCsrfToken(res: Response | undefined) {
  if (!res) return;
  let csrf = res.headers.get('X-Set-Csrf-Token');
  if (csrf) {
    sessionStorage.setItem('CSRF_TOKEN', csrf);
  }
}

/**
 * Does the app possess a csrf token
 * 
 * @returns true if CSRF token found false otherwise
 */
export function isCsrf() {
  return sessionStorage.getItem('CSRF_TOKEN') !== null;
}

/**
 * Get the necessary headers for API requests
 * 
 * @returns Object with separate headers
 */
export function csrfHeaders() {
  let token = sessionStorage.getItem('CSRF_TOKEN');
  if (token) {
    return {'X-Csrf-Token': token};
  }
  return {'X-Csrf-Token': 'NO_CSRF_TOKEN'}
}
