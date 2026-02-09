import type { SrsStageFilter } from "../types";

const matchesSingleSrsFilter = (
  srsStage: number | undefined,
  filter: SrsStageFilter,
): boolean => {
  if (srsStage === undefined) {
    return filter === "locked";
  }

  switch (filter) {
    case "locked":
      return srsStage === 0;
    case "apprentice1":
      return srsStage === 1;
    case "apprentice2":
      return srsStage === 2;
    case "apprentice3":
      return srsStage === 3;
    case "apprentice4":
      return srsStage === 4;
    case "guru1":
      return srsStage === 5;
    case "guru2":
      return srsStage === 6;
    case "master":
      return srsStage === 7;
    case "enlightened":
      return srsStage === 8;
    case "burned":
      return srsStage === 9;
    default:
      return true;
  }
};

export const matchesSrsFilters = (
  srsStage: number | undefined,
  filters: SrsStageFilter[],
): boolean => {
  if (filters.length === 0) {
    return true;
  }

  return filters.some((filter) => matchesSingleSrsFilter(srsStage, filter));
};
