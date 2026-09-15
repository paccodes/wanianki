import type { CuratedLeechGroup, CuratedLeechScope } from "../types";

interface Params {
  groups: CuratedLeechGroup[];
  enabledListIds: string[];
  scope: CuratedLeechScope;
  strugglingSubjectIds: Set<number>;
}

const isStruggling = (
  subjectIds: number[],
  strugglingSubjectIds: Set<number>,
): boolean => subjectIds.some((id) => strugglingSubjectIds.has(id));

export const getCuratedLeechGroups = ({
  groups,
  enabledListIds,
  scope,
  strugglingSubjectIds,
}: Params): number[][] =>
  groups
    .filter(
      ({ listId, subjectIds }) =>
        enabledListIds.includes(listId) &&
        (scope === "all" || isStruggling(subjectIds, strugglingSubjectIds)),
    )
    .map(({ subjectIds }) => subjectIds);
