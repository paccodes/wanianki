import { getLevelsQueryParameter } from "./get-levels-query-parameters";

export const getAssignmentsUrl = (
  startLevel: number,
  endLevel: number,
): string =>
  `/assignments?subject_types=kanji,radical,vocabulary&levels=${getLevelsQueryParameter(startLevel, endLevel)}`;
