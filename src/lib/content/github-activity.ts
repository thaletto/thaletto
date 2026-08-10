import { z } from 'zod'

export interface GitHubActivity {
  user: string
  followers: number
  total: number
  from: string
  to: string
  levels: string
}

type FetchResponse = Pick<Response, 'ok' | 'status' | 'json'>
export type GitHubFetcher = (input: string, init?: RequestInit) => Promise<FetchResponse>

const isoDate = /^\d{4}-\d{2}-\d{2}$/
const contributionSchema = z.object({
  total: z.object({ lastYear: z.number().int().nonnegative() }),
  contributions: z
    .array(z.object({ date: z.string().regex(isoDate), level: z.number().int().min(0).max(4) }))
    .min(1)
    .max(400),
})
const userSchema = z.object({ login: z.string().min(1), followers: z.number().int().nonnegative() })

function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
}

export function normalizeGitHubActivity(
  contributionInput: unknown,
  userInput: unknown,
  user: string,
): GitHubActivity {
  const contributionResult = contributionSchema.safeParse(contributionInput)
  if (!contributionResult.success) {
    const message = formatIssues(contributionResult.error)
    throw new Error(
      `Invalid GitHub contribution ${message.includes('contributions') ? 'range' : 'response'} — ${message}`,
    )
  }
  const userResult = userSchema.safeParse(userInput)
  if (!userResult.success)
    throw new Error(`Invalid GitHub user response — ${formatIssues(userResult.error)}`)
  if (userResult.data.login !== user) throw new Error('GitHub response account does not match')

  const days = contributionResult.data.contributions
  for (let index = 0; index < days.length; index += 1) {
    const day = days[index]
    if (new Date(`${day.date}T00:00:00.000Z`).toISOString().slice(0, 10) !== day.date) {
      throw new Error(`Invalid GitHub contribution date at index ${index}`)
    }
    if (index > 0 && days[index - 1].date >= day.date) {
      throw new Error('GitHub contribution dates must be strictly increasing')
    }
  }

  return {
    user,
    followers: userResult.data.followers,
    total: contributionResult.data.total.lastYear,
    from: days[0].date,
    to: days[days.length - 1].date,
    levels: days.map((day) => day.level).join(''),
  }
}

const bakedActivitySchema = z.object({
  followers: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  from: z.string().regex(isoDate),
  to: z.string().regex(isoDate),
  levels: z.string().regex(/^[0-4]{1,400}$/),
})

export function normalizeBakedGitHubActivity(input: unknown, user: string): GitHubActivity {
  const result = bakedActivitySchema.safeParse(input)
  if (!result.success)
    throw new Error(`Invalid baked GitHub Activity — ${formatIssues(result.error)}`)
  return { user, ...result.data }
}

export async function loadGitHubActivity({
  user,
  fetcher = fetch,
  fallback,
}: {
  user: string
  fetcher?: GitHubFetcher
  fallback?: unknown
}): Promise<GitHubActivity> {
  try {
    const [contributionResponse, userResponse] = await Promise.all([
      fetcher(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`),
      fetcher(`https://api.github.com/users/${user}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': user },
      }),
    ])
    if (!contributionResponse.ok) {
      throw new Error(
        `GitHub contribution retrieval failed with HTTP ${contributionResponse.status}`,
      )
    }
    if (!userResponse.ok) {
      throw new Error(`GitHub user retrieval failed with HTTP ${userResponse.status}`)
    }
    return normalizeGitHubActivity(
      await contributionResponse.json(),
      await userResponse.json(),
      user,
    )
  } catch (error) {
    if (fallback !== undefined) return normalizeBakedGitHubActivity(fallback, user)
    throw error
  }
}
