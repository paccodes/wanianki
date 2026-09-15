export const getPluralizedQuantity = (word: string, amount: number): string => {
  if (amount === 1) {
    return `${amount} ${word}`;
  }

  return `${amount} ${word}${word.endsWith("ch") ? "es" : "s"}`;
};
