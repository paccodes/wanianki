import type { ReviewSubject, SrsStageFilter } from "../types";

import { matchesSrsFilters } from "./matches-srs-filters";

const LOCKED_FILTERS: SrsStageFilter[] = ["locked"];

const hasStartedAssignment = ({ srs_stage }: ReviewSubject): boolean =>
  !matchesSrsFilters(srs_stage, LOCKED_FILTERS);

const isWithinUserLevel = (
  { data }: ReviewSubject,
  userLevel: number | undefined,
): boolean => userLevel === undefined || data.level <= userLevel;

export const getAvailableSubjects = (
  subjects: ReviewSubject[],
  userLevel?: number,
): ReviewSubject[] => {
  const hasSrsStages = subjects.some(
    ({ srs_stage }) => srs_stage !== undefined,
  );

  return subjects.filter(
    (subject) =>
      isWithinUserLevel(subject, userLevel) &&
      (!hasSrsStages || hasStartedAssignment(subject)),
  );
};
