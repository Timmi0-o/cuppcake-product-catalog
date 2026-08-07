---
name: prisma-repository
description: Implement Prisma repository adapter with row-mappers and TransactionScope unwrap.
---

# Prisma repository

## Output

```text
src/modules/<feature>/infrastructure/persistence/
  row-mappers/<entity>/map-<entity>-row.ts
  repositories/<entity>/prisma-<entity>.repository.ts
```

## Rules

- Implements domain port
- `unwrapPrismaTxFromScope(scope)` for transactional writes
- No domain leakage of Prisma types
- Wire in `src/lib/di/<feature>.container.ts`
