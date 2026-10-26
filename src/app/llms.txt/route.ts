import { llmsIndex, textResponse } from '~/lib/agents/markdown'

export function GET() {
  return textResponse(llmsIndex())
}
