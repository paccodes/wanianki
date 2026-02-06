import type { SubjectType } from "../types";

import { getLevelsQueryParameter } from "./get-levels-query-parameters";

export const getSubjectsUrl = (
  startLevel: number,
  endLevel: number,
  subjectType: SubjectType,
): string =>
  `/subjects?types=${subjectType}&levels=${getLevelsQueryParameter(startLevel, endLevel)}`;
