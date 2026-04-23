/** Strip tags for a safe one-line or paragraph preview. */
export function stripHtml(dirty: string | undefined): string {
  if (!dirty) return ''
  return dirty
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
