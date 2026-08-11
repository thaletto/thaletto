/**
 * Full-page navigation behind one seam. `window.location` methods
 * cannot be stubbed directly (the Location object is sealed), so flows
 * that hand off across pages or re-enter authentication go through these
 * helpers.
 */
export function assignLocation(url: string) {
  window.location.assign(url)
}

export function reloadLocation() {
  window.location.reload()
}
