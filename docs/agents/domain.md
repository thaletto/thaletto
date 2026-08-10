# Domain Docs

How engineering skills consume this repository’s domain documentation.

## Before exploring, read these

- `CONTEXT.md` at the repository root.
- `docs/adr/` entries relevant to the area being changed.

If these files do not exist, proceed silently. Domain-modeling workflows create them lazily when concepts or decisions are resolved.

## Layout

This is a single-context repository:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary’s vocabulary

Use terms as defined in `CONTEXT.md` when naming domain concepts, issues, modules, tests, and refactor proposals. Do not substitute synonyms the glossary explicitly avoids.

If a required concept is absent, reconsider whether new language is necessary or record the gap for domain modeling.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, identify the conflict explicitly rather than silently overriding it.
