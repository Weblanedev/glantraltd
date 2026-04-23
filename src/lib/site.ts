/** Display name for the storefront (Glantra). */
export function siteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME || 'Glantra'
}

/** Domain used in copy (e.g. email, policies). */
export function siteDomain() {
  return process.env.NEXT_PUBLIC_SITE_DOMAIN || 'glantrastore.com'
}
