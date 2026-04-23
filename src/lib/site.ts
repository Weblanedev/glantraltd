/** Short display / storefront name. */
export function siteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME || 'Glantra'
}

/** Legal entity name. */
export function siteLegalName() {
  return process.env.NEXT_PUBLIC_LEGAL_NAME || 'Glantra Limited'
}

/** Public website domain, without protocol (e.g. glantrastore.com). */
export function siteDomain() {
  return process.env.NEXT_PUBLIC_SITE_DOMAIN || 'glantrastore.com'
}

/** One-line business description. */
export function siteTagline() {
  return (
    process.env.NEXT_PUBLIC_TAGLINE ||
    'General merchandise and sales of computers.'
  )
}
