// Single source of truth for the account(s) the refresh scripts query.
// The app reads the same user from the baked content/github.json snapshot,
// so changing this and re-running the script keeps both in sync.
export const GITHUB_USER = 'thaletto'
export const GITHUB_USER_AGENT = 'thaletto'