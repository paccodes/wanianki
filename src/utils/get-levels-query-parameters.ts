export const getLevelsQueryParameter = (
  startLevel: number,
  endLevel: number,
): string =>
  Array.from(
    { length: endLevel - startLevel + 1 },
    (_, index) => startLevel + index,
  ).join(",");
