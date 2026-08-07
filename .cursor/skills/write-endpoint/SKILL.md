---
name: write-endpoint
description: Add a mutate HTTP endpoint (POST/PATCH/DELETE) with Zod, mapper, use-case, Route Handler.
---

# Write endpoint

1. Application DTO + UseCase (`execute`, TX if mutate)
2. Zod schema under `presentation/http/validation/schemas`
3. Request mapper `request-body-to-*-use-case-input.ts`
4. HTTP response mapper
5. Route Handler in `src/app/api/v1/.../route.ts` — validate → auth → map → execute → jsonResult
6. Register use-case in `src/lib/di/<feature>.container.ts`

Controller must not touch repositories.
