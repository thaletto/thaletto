BUN := bun

.DEFAULT_GOAL := help

.PHONY: install dev build start preview format lint fix check typecheck test clean data refresh help

## Install dependencies with bun
install:
	$(BUN) install

## Start the Next.js dev server with hot reload
dev:
	$(BUN) run dev

## Production build (runs the GitHub refresh prebuild step first)
build:
	$(BUN) run build

## Serve the production build (`make build` first)
start:
	$(BUN) run start

## Auto-format all source files with Biome
format:
	$(BUN) run format

## Lint only (report, no writing)
lint:
	$(BUN) run lint

## Inplace fix all fixable issues
fix:
	$(BUN) run fix

## Check formatting + lint without writing
formatcheck:
	$(BUN) exec biome check .

## Full TypeScript typecheck (no emit)
typecheck:
	$(BUN) exec tsc --noEmit

## Delete the .next build output
clean:
	rm -rf .next

## Refresh GitHub/social data baked into the content
data:
	node src/scripts/refresh-github.mjs

## Alias for `data`
refresh: data

help:
	@echo "Available targets:"; \
	for t in install dev build start format lint fix formatcheck typecheck clean data refresh; do \
		desc="$$(grep -A0 -B1 -m1 "^$$t:" Makefile | grep '^##' | sed 's/## //')"; \
		printf '  %-12s %s\n' "$$t" "$$desc"; \
	done