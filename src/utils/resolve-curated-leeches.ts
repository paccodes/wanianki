import type { CuratedLeechGroup, CuratedLeechList } from "../types";

import { getLeechGroupIds } from "./get-leech-group-ids";

const MINIMUM_CONFUSABLE_GROUP_SIZE = 2;

interface Params {
  lists: CuratedLeechList[];
  subjectIdsByCharacters: Map<string, number[]>;
  drillableSubjectIds: Set<number>;
}

export const resolveCuratedLeeches = ({
  lists,
  subjectIdsByCharacters,
  drillableSubjectIds,
}: Params): CuratedLeechGroup[] => {
  const resolvedGroups: CuratedLeechGroup[] = [];

  for (const list of lists) {
    for (const group of list.groups) {
      const resolvedGroup = group
        .map((characters) =>
          (subjectIdsByCharacters.get(characters) ?? []).filter((id) =>
            drillableSubjectIds.has(id),
          ),
        )
        .filter((ids) => ids.length > 0);

      if (resolvedGroup.length >= MINIMUM_CONFUSABLE_GROUP_SIZE) {
        resolvedGroups.push({
          listId: list.id,
          subjectIds: getLeechGroupIds(resolvedGroup),
        });
      }
    }
  }

  return resolvedGroups;
};
