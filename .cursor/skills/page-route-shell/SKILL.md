---
name: page-route-shell
description: >-
  Adds a thin App Router page that renders a colocated components/pages screen.
  Use when creating a new route/screen shell without putting data logic in
  app/.../page.tsx.
---

# Page route shell

## Read first

- Rules: `component-colocation.mdc`, `ux-intuitive-yandex.mdc`
- Etalon route: `src/app/product/[id]/page.tsx`
- Etalon page: `src/components/pages/product/product-page.tsx`

## Output

```text
src/app/…/page.tsx                    # thin: params → <XxxPage />
src/components/pages/<feature>/
  <feature>-page.tsx
  <feature>-page.module.css           # if needed
  components/…                        # colocated pieces
```

## Pattern

```tsx
import { ProductPage } from '@/components/pages/product/product-page'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductPage productId={id} />
}
```

## Rules

- **Не** фетчить доменные данные в `app/.../page.tsx` — данные в page component / hooks
- Импорт page-компонента полным путём до файла
- CSS modules: `css-modules-no-animate-apply.mdc`

## Checklist

- [ ] Thin app page
- [ ] Colocated page component under `components/pages/`
- [ ] Page-local pieces under `components/pages/<feature>/components/`
