---
name: domain-repository
description: Create domain repository port + token for an aggregate.
---

# Domain repository

## Output

```text
src/modules/<feature>/domain/repositories/<entity>/
  i-<entity>.repository.ts
  index.ts
```

## Pattern

```ts
export interface IProductRepository {
  create(input: ICreateProductInput, scope?: TransactionScope): Promise<IProductEntity>;
  // ...
}
export const PRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');
```

Read `.cursor/rules/domain-repositories.mdc`.
