export const getToggledArray = <T>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
