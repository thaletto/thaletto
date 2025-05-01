#!/bin/bash

echo "Starting project init script..."
# Init Shadcn
# Components Installation
bunx --bun shadcn@latest add button
bunx --bun shadcn@latest add card
bunx --bun shadcn@latest add separator
bunx --bun shadcn@latest add skeleton
bunx --bun shadcn@latest add toggle
bunx --bun shadcn@latest add tooltip
bunx --bun shadcn@latest add hover-card
bunx --bun shadcn@latest add badge

# Magic UI Components Installation
bun x --bun shadcn@latest add "https://magicui.design/r/dock"
bun x --bun shadcn@latest add "https://magicui.design/r/border-beam"
bun x --bun shadcn@latest add "https://magicui.design/r/shine-border"
bun x --bun shadcn@latest add "https://magicui.design/r/magic-card"
bun x --bun shadcn@latest add "https://magicui.design/r/meteors"
bun x --bun shadcn@latest add "https://magicui.design/r/neon-gradient-card"
bun x --bun shadcn@latest add "https://magicui.design/r/cool-mode"
bun x --bun shadcn@latest add "https://magicui.design/r/blur-fade"
bun x --bun shadcn@latest add "https://magicui.design/r/aurora-text"
bun x --bun shadcn@latest add "https://magicui.design/r/line-shadow-text"
bun x --bun shadcn@latest add "https://magicui.design/r/text-animate"
bun x --bun shadcn@latest add "https://magicui.design/r/hyper-text"
bun x --bun shadcn@latest add "https://magicui.design/r/typing-animation"
bun x --bun shadcn@latest add "https://magicui.design/r/sparkles-text"
bun x --bun shadcn@latest add "https://magicui.design/r/spinning-text"
bun x --bun shadcn@latest add "https://magicui.design/r/warp-background"
bun x --bun shadcn@latest add "https://magicui.design/r/interactive-grid-pattern"

echo "Script completed."