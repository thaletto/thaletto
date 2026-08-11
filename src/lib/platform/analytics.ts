import { track } from '@vercel/analytics'

/**
 * The public AMA booking funnel, counted without identifiers. Events carry
 * no properties by design: names, emails, briefs, and hold ids never reach
 * analytics.
 */
export type FunnelEvent =
  | 'ama_slot_selected'
  | 'ama_hold_created'
  | 'ama_checkout_started'
  | 'ama_alternate_time_requested'
  | 'ama_booking_paid'

export function trackFunnelEvent(name: FunnelEvent) {
  try {
    track(name)
  } catch {
    // Analytics must never interrupt a booking.
  }
}
