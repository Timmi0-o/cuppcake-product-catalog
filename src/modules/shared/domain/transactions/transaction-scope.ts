declare const __transactionScopeBrand: unique symbol;

export type TransactionScope = {
  readonly [__transactionScopeBrand]: 'TransactionScope';
};
