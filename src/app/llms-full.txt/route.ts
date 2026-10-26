import { llmsFull, textResponse } from '~/lib/agents/markdown'

export function GET() {
  return textResponse(llmsFull())
}
