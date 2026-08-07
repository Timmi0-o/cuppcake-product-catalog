export const isNumberTest = (value: unknown): boolean => {
  return typeof value === 'number' || /^-?\d+(\.\d+)?$/.test(String(value));
};
