import { markdownForPath, markdownResponse } from '~/lib/agents/markdown'

export async function GET(request: Request) {
  const path = request.headers.get('x-agent-markdown-path') ?? '/'
  const { markdown, status } = markdownForPath(path)
  return markdownResponse(markdown, status)
}
