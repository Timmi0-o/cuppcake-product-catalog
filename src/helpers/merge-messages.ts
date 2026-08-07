export const mergeMessages = (
  accumulatedMessages: Record<string, unknown>,
  newMessages: Record<string, unknown>,
): Record<string, unknown> => {
  const result = { ...accumulatedMessages };

  for (const key in newMessages) {
    if (Object.prototype.hasOwnProperty.call(newMessages, key)) {
      const newVal = newMessages[key];
      const existingVal = result[key];

      if (
        typeof newVal === 'object' &&
        newVal !== null &&
        typeof existingVal === 'object' &&
        existingVal !== null
      ) {
        result[key] = mergeMessages(
          existingVal as Record<string, unknown>,
          newVal as Record<string, unknown>,
        );
      } else {
        result[key] = newVal;
      }
    }
  }

  return result;
};
