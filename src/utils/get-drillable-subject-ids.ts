import type { ReviewSubject } from "../types";

interface Params {
  subjects: ReviewSubject[];
  availableSubjectIds: Set<number>;
  strugglingSubjectIds: Set<number>;
}

export const getDrillableSubjectIds = ({
  subjects,
  availableSubjectIds,
  strugglingSubjectIds,
}: Params): Set<number> => {
  const drillableSubjectIds = new Set<number>();

  for (const { id } of subjects) {
    if (availableSubjectIds.has(id) || strugglingSubjectIds.has(id)) {
      drillableSubjectIds.add(id);
    }
  }

  return drillableSubjectIds;
};
