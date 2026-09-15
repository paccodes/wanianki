import { getLevelsQueryParameter } from "./get-levels-query-parameters";
import { getSubjectTypesQueryParameter } from "./get-subject-types-query-parameter";

export const getAssignmentsUrl = (
  startLevel: number,
  endLevel: number,
): string =>
  `/assignments?subject_types=${getSubjectTypesQueryParameter()}&levels=${getLevelsQueryParameter(startLevel, endLevel)}`;
