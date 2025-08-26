
export function setCsrfToken(res: Response | undefined) {
  if (!res) return;
  let csrf = res.headers.get('X-Set-Csrf-Token');
  if (csrf) {
    sessionStorage.setItem('CSRF_TOKEN', csrf);
  }
}

export function isCsrf() {
  return sessionStorage.getItem('CSRF_TOKEN') !== null;
}

export function csrfHeaders() {
  let token = sessionStorage.getItem('CSRF_TOKEN');
  if (token) {
    return {'X-Csrf-Token': token};
  }
  return {'X-Csrf-Token': 'NO_CSRF_TOKEN'}
}
