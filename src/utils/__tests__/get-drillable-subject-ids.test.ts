import { describe, expect, it } from "vitest";

import type { Kanji, ReviewSubject } from "../../types";

import { getDrillableSubjectIds } from "../get-drillable-subject-ids";

const getKanji = (id: number): ReviewSubject =>
  ({
    id,
    object: "kanji",
    data: { characters: "土", level: 1 } as Kanji,
  }) as ReviewSubject;

const getParams = (
  overrides: Partial<Parameters<typeof getDrillableSubjectIds>[0]>,
) =>
  ({
    subjects: [],
    availableSubjectIds: new Set<number>(),
    strugglingSubjectIds: new Set<number>(),
    ...overrides,
  }) satisfies Parameters<typeof getDrillableSubjectIds>[0];

describe("getDrillableSubjectIds", () => {
  it("returns an empty set when no subject is given", () => {
    expect(
      getDrillableSubjectIds(
        getParams({
          availableSubjectIds: new Set([1]),
          strugglingSubjectIds: new Set([2]),
        }),
      ),
    ).toEqual(new Set());
  });

  it("keeps the subjects WaniKani has already taught", () => {
    expect(
      getDrillableSubjectIds(
        getParams({
          subjects: [getKanji(1), getKanji(2)],
          availableSubjectIds: new Set([1]),
        }),
      ),
    ).toEqual(new Set([1]));
  });

  it("keeps a struggling subject the user cannot otherwise reach", () => {
    expect(
      getDrillableSubjectIds(
        getParams({
          subjects: [getKanji(1), getKanji(2)],
          strugglingSubjectIds: new Set([2]),
        }),
      ),
    ).toEqual(new Set([2]));
  });

  it("lists a subject once when both rules claim it", () => {
    expect(
      getDrillableSubjectIds(
        getParams({
          subjects: [getKanji(1)],
          availableSubjectIds: new Set([1]),
          strugglingSubjectIds: new Set([1]),
        }),
      ),
    ).toEqual(new Set([1]));
  });

  it("drops a subject neither rule claims", () => {
    expect(
      getDrillableSubjectIds(
        getParams({
          subjects: [getKanji(1)],
          availableSubjectIds: new Set([2]),
          strugglingSubjectIds: new Set([3]),
        }),
      ),
    ).toEqual(new Set());
  });

  it("ignores ids that are not in the collection", () => {
    expect(
      getDrillableSubjectIds(
        getParams({
          subjects: [getKanji(1)],
          availableSubjectIds: new Set([1, 99]),
          strugglingSubjectIds: new Set([98]),
        }),
      ),
    ).toEqual(new Set([1]));
  });
});
