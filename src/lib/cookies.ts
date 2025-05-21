/**
 * Cookie utilities for client-side cookie management
 */

// Cookie options type
export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  // Ensure we're running in the browser
  if (typeof document === 'undefined') return;

  const cookieOptions = { ...options };

  // Build the cookie string
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.maxAge) {
    cookie += `; Max-Age=${cookieOptions.maxAge}`;
  }

  if (cookieOptions.expires) {
    cookie += `; Expires=${cookieOptions.expires.toUTCString()}`;
  }

  if (cookieOptions.path) {
    cookie += `; Path=${cookieOptions.path}`;
  }

  if (cookieOptions.domain) {
    cookie += `; Domain=${cookieOptions.domain}`;
  }

  if (cookieOptions.secure) {
    cookie += '; Secure';
  }

  if (cookieOptions.sameSite) {
    cookie += `; SameSite=${cookieOptions.sameSite}`;
  }

  document.cookie = cookie;
}

/**
 * Get a cookie by name
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  // Ensure we're running in the browser
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const nameEQ = `${encodeURIComponent(name)}=`;

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string, options: CookieOptions = {}) {
  // Set an expired date to remove the cookie
  setCookie(name, '', {
    ...options,
    maxAge: -1,
  });
}
