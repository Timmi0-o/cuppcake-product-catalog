---
name: list-detail-ui
description: >-
  Implements list and detail screens following Yandex-style UX (soft cards list,
  stacked detail). Use for catalog grid and product detail.
---

# List / detail UI

## Read first

- Rule: `ux-intuitive-yandex.mdc`
- Etalon list: `components/pages/catalog/`
- Etalon detail: `components/pages/product/`
- Shared card: `components/shared/components/product/product-card/`
- Skill: `page-route-shell`

## Patterns

**List (catalog)**
- Отдельные soft-cards на элемент (`ProductCard`)
- Page-local filter/grid в `pages/catalog/components/`

**Detail (product)**
- Gallery + stacked info sections
- Page-local gallery в `pages/product/components/`

## Checklist

- [ ] Thin route shell
- [ ] Colocated page + components
- [ ] Shared card only under `shared/components/`
- [ ] UX antipatterns checked
