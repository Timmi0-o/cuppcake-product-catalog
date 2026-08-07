---
name: read-endpoint
description: Add a read HTTP endpoint (GET list/one) with Zod query, mapper, use-case, Route Handler.
---

# Read endpoint

1. Application input DTO + read UseCase
2. Zod query/params schema
3. `request-query-params-to-*` / `request-params-to-*` mapper
4. HTTP response mapper
5. Route Handler: auth → parse → execute → `jsonResult`
6. Wire in composition root

No repositories in presentation.
