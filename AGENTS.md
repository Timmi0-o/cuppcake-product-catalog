<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Конвенции проекта

## Frontend layout (как my-master-next-app)

```
src/app/…/page.tsx                 # thin route shell
src/components/pages/<feature>/    # экраны + page-local components/
src/components/shared/ui/          # shadcn primitives
src/components/shared/components/  # reusable composed UI
src/components/widgets/            # chrome (header)
```

## Colocation

Компонент с зависимостями — папка `component-name/component-name.tsx`.  
Подробнее: `.cursor/rules/component-colocation.mdc`.

## Skills

- `page-route-shell` — новый route
- `list-detail-ui` — каталог / деталь товара
- Backend: `domain-entity`, `prisma-repository`, `write-endpoint`, `read-endpoint`

Перед задачей читай `.cursor/rules/read-project-rules-first.mdc`.
