export const getLeechGroupIds = (groups: number[][]): number[] => [
  ...new Set(groups.flat()),
];
