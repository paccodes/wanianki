import type { Sortable } from "../types";

export const getSortedByIdAndLevel = <T extends Sortable>(array: T[]): T[] => {
  return [...array]
    .sort((a, b) => a.id - b.id)
    .sort((a, b) => a.data.level - b.data.level);
};
