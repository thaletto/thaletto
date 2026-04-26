# Navigation Sounds

Crossfade navigation sound system using Tone.js — provides exit/enter audio feedback that complements React's ViewTransition API.

## Installation

Ensure `tone` is installed:

```bash
bun add tone
```

## Architecture

```
@/lib/sound/
├── index.ts       # Core playback functions (playEnter, playExit, dispose)
├── trigger.ts    # NavSoundTrigger component for enter sounds
```

### Two-Sound Arc

Navigation in Next.js App Router doesn't expose a "before navigate" hook, so this system splits the responsibility:

1. **Exit sound** — fired manually in each `<Link>` via `NavLink` component
2. **Enter sound** — fired automatically by `NavSoundTrigger` on route change

## Usage

### 1. Add NavSoundTrigger to Layout

Place once in your root layout (below `<TooltipProvider>` is fine):

```tsx
// app/layout.tsx
import { NavSoundTrigger } from "@/lib/sound/trigger"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TooltipProvider>
          <NavSoundTrigger />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
```

### 2. Use NavLink Instead of Link

Wrap navigation links in `NavLink` to fire exit sounds before navigation:

```tsx
// components/navbar.tsx
import { NavLink } from "@/components/nav-link"

export function Navbar() {
  return (
    <nav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/projects">Projects</NavLink>
      <NavLink href="/about">About</NavLink>
    </nav>
  )
}
```

### 3. Alternative: Manual Exit Sound

If you can't use `NavLink`, call `playExit()` directly in your Link's onClick:

```tsx
import Link from "next/link"
import { sounds } from "@/lib/sound"

<Link href="/projects" onClick={() => sounds.playExit()}>
  Projects
</Link>
```

## API Reference

### sounds.playEnter()

Plays an ascending tonal step (D4 → G4) layered with an arpeggiated chord bloom (C4 → E4 → G4). Designed to complement the crossfade transition — the chord's 2.2s release creates an ambient tail that outlasts the visual transition.

```ts
await sounds.playEnter()
```

### sounds.playExit()

Plays a descending tonal step (G4 → D4) with a reversed chord bloom. Slightly quieter and shorter than the enter sound to avoid competing with it (~200ms later).

```ts
sounds.playExit() // fire and forget (async, but no need to await)
```

### sounds.setMuted(muted: boolean)

Enables or disables audio playback entirely. When muted, all `playEnter()` and `playExit()` calls no-op immediately without initializing Tone.js.

```ts
sounds.setMuted(true) // disable all sounds
sounds.setMuted(false) // re-enable
```

### sounds.setVolume(volume: number)

Sets the master volume. Maps linear input (0..1) to decibels. At 0, outputs -Infinity (silent).

```ts
sounds.setVolume(0.5) // ~-20dB
sounds.setVolume(0)   // mute
```

### sounds.dispose()

Disposes all Tone.js nodes and resets state. Call during dev HMR cleanup to prevent orphaning audio nodes.

```ts
if (process.env.NODE_ENV === "development") {
  dispose()
}
```

### NavSoundTrigger

Headless component that watches `pathname` and fires `playNavEnter()` on route changes. Skips the initial page load — only fires for actual navigations. Uses a 300ms desired gap from exit → enter to sync with React's ViewTransition crossfade — the enter sound plays after the visual transition begins, creating a cohesive sonic arc across the page change.

```tsx
<NavSoundTrigger />
```

### NavLink

Wrapper around Next.js Link that fires `playNavExit()` in onClick before navigation. Equivalent to:

```tsx
<Link href="/path" onClick={() => sounds.playExit()}>
  Label
</Link>
```

## Design Notes

- **Audio character**: Soft, spatial, ambient — not attention-grabbing. Uses sine oscillators with a long-release reverb tail.
- **Timing**: The exit sound plays immediately on click; the enter sound fires after a 300ms gap from exit. This creates a consistent sonic arc regardless of how fast the route resolves — the gap is measured from when the exit sound actually fired, not when the pathname changed.
- **Browser autoplay**: Tone.js requires user interaction before playing audio. The first link click will initialize the audio context implicitly.
- **Server-side rendering**: All functions check `typeof window` and no-op on the server — safe to use in SSR contexts.
- **Scale**: Uses a pentatonic scale (C, D, E, G, A) cycling through adjacent degrees for tight harmony during rapid navigation.