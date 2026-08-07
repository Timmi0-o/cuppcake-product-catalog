---
name: domain-entity
description: Create a domain entity folder (interfaces, policies, errors) for product-catalog modules.
---

# Domain entity

## Output

```text
src/modules/<feature>/domain/entities/<entity>/
  i-<entity>.entity.ts
  i-create-<entity>.input.ts
  i-update-<entity>.input.ts   # if needed
  policies/
  errors/
  index.ts
```

## Rules

- Interfaces only; no classes for entities
- Policies: pure `ensure*` functions
- Errors extend `DomainError` with stable `code`
- Read `.cursor/rules/domain-entities.mdc` and `entity-creation-sequence.mdc`
