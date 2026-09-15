import { describe, expect, it } from "vitest";

import type { Kanji, SubjectResponseWithSrsStage } from "../../types";

import { getConfusionLeechGroups } from "../get-confusion-leech-groups";

const getKanji = (
  id: number,
  visuallySimilarSubjectIds: number[],
): SubjectResponseWithSrsStage<Kanji> =>
  ({
    id,
    object: "kanji",
    srs_stage: 1,
    data: {
      characters: "土",
      level: 1,
      visually_similar_subject_ids: visuallySimilarSubjectIds,
    } as Kanji,
  }) as SubjectResponseWithSrsStage<Kanji>;

const kanjiCollection = [
  getKanji(1, [2, 3]),
  getKanji(2, [1]),
  getKanji(3, [1]),
  getKanji(4, []),
];

const drillableSubjectIds = new Set([1, 2, 3, 4]);

describe("getConfusionLeechGroups", () => {
  it("returns nothing when the collection is empty", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection: [],
        drillableSubjectIds,
        strugglingSubjectIds: new Set([1]),
      }),
    ).toEqual([]);
  });

  it("returns nothing when no kanji is struggling", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds,
        strugglingSubjectIds: new Set(),
      }),
    ).toEqual([]);
  });

  it("opens the group with the struggling kanji, then its look-alikes", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds,
        strugglingSubjectIds: new Set([1]),
      }),
    ).toEqual([[1, 2, 3]]);
  });

  it("drops look-alikes that are neither unlocked nor struggling", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds: new Set([1, 3]),
        strugglingSubjectIds: new Set([1]),
      }),
    ).toEqual([[1, 3]]);
  });

  it("skips a struggling kanji whose look-alikes are all undrillable", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds: new Set([1]),
        strugglingSubjectIds: new Set([1]),
      }),
    ).toEqual([]);
  });

  it("skips a struggling kanji that has no look-alike at all", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds,
        strugglingSubjectIds: new Set([4]),
      }),
    ).toEqual([]);
  });

  it("tolerates a missing visually_similar_subject_ids field", () => {
    const kanji = getKanji(5, []);

    delete (kanji.data as Partial<Kanji>).visually_similar_subject_ids;

    expect(
      getConfusionLeechGroups({
        kanjiCollection: [kanji],
        drillableSubjectIds: new Set([5]),
        strugglingSubjectIds: new Set([5]),
      }),
    ).toEqual([]);
  });

  it("does not check the seed against the drillable set", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds: new Set([2, 3]),
        strugglingSubjectIds: new Set([1]),
      }),
    ).toEqual([[1, 2, 3]]);
  });

  it("returns one group per struggling kanji, overlaps included", () => {
    expect(
      getConfusionLeechGroups({
        kanjiCollection,
        drillableSubjectIds,
        strugglingSubjectIds: new Set([2, 3]),
      }),
    ).toEqual([
      [2, 1],
      [3, 1],
    ]);
  });
});
