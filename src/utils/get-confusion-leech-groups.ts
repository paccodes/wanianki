import type { Kanji, SubjectResponseWithSrsStage } from "../types";

interface Params {
  kanjiCollection: SubjectResponseWithSrsStage<Kanji>[];
  drillableSubjectIds: Set<number>;
  strugglingSubjectIds: Set<number>;
}

export const getConfusionLeechGroups = ({
  kanjiCollection,
  drillableSubjectIds,
  strugglingSubjectIds,
}: Params): number[][] => {
  const groups: number[][] = [];

  for (const kanji of kanjiCollection) {
    if (!strugglingSubjectIds.has(kanji.id)) {
      continue;
    }

    const similarKanjiIds = (
      kanji.data.visually_similar_subject_ids ?? []
    ).filter((similarKanjiId) => drillableSubjectIds.has(similarKanjiId));

    if (similarKanjiIds.length === 0) {
      continue;
    }

    groups.push([kanji.id, ...similarKanjiIds]);
  }

  return groups;
};
