/**
 * Full-page navigation behind one seam. jsdom cannot stub
 * `window.location` methods directly (the Location object is sealed), so
 * flows that hand off across pages or re-enter authentication go through
 * these helpers, which tests replace with `vi.mock`.
 */
export function assignLocation(url: string) {
  window.location.assign(url)
}

export function reloadLocation() {
  window.location.reload()
}
