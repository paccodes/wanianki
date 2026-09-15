import { describe, expect, it } from "vitest";

import type { LeechSource } from "../../types";

import { getPooledLeeches } from "../get-pooled-leeches";

const getParams = (
  overrides: Partial<Parameters<typeof getPooledLeeches>[0]>,
) =>
  ({
    enabledSources: ["statistical", "manual", "confusion", "curated"],
    statisticalScores: new Map<number, number>(),
    manualSubjectIds: [],
    confusionGroups: [],
    curatedGroups: [],
    knownSubjects: new Map([1, 2, 3, 4, 5].map((id) => [id, null] as const)),
    ...overrides,
  }) satisfies Parameters<typeof getPooledLeeches>[0];

describe("getPooledLeeches", () => {
  it("returns an empty array when no source contributes", () => {
    expect(getPooledLeeches(getParams({}))).toEqual([]);
  });

  it("carries the statistical score onto the item", () => {
    expect(
      getPooledLeeches(getParams({ statisticalScores: new Map([[1, 2.5]]) })),
    ).toEqual([{ subjectId: 1, sources: ["statistical"], score: 2.5 }]);
  });

  it("gives manual leeches no score", () => {
    expect(getPooledLeeches(getParams({ manualSubjectIds: [1] }))).toEqual([
      { subjectId: 1, sources: ["manual"], score: 0 },
    ]);
  });

  it("lists a subject once with every source that found it", () => {
    const [leech] = getPooledLeeches(
      getParams({
        statisticalScores: new Map([[1, 3]]),
        manualSubjectIds: [1],
      }),
    );

    expect(leech?.sources).toEqual(["statistical", "manual"]);
    expect(leech?.score).toBe(3);
  });

  it("keeps the highest score when several sources score the same subject", () => {
    const [leech] = getPooledLeeches(
      getParams({
        statisticalScores: new Map([[1, 4]]),
        confusionGroups: [[1, 2]],
      }),
    );

    expect(leech?.score).toBe(4);
  });

  it("tags grouped members with a group id scoped to their source", () => {
    expect(
      getPooledLeeches(
        getParams({
          confusionGroups: [
            [1, 2],
            [3, 4],
          ],
        }),
      ).map(({ subjectId, groupId }) => [subjectId, groupId]),
    ).toEqual([
      [1, "confusion:0"],
      [2, "confusion:0"],
      [3, "confusion:1"],
      [4, "confusion:1"],
    ]);
  });

  it("keeps a subject in the first group that claimed it", () => {
    const leeches = getPooledLeeches(
      getParams({
        confusionGroups: [[1, 2]],
        curatedGroups: [[2, 3]],
      }),
    );

    expect(leeches.find(({ subjectId }) => subjectId === 2)?.groupId).toBe(
      "confusion:0",
    );
  });

  it("drops subjects the collection does not hold", () => {
    expect(
      getPooledLeeches(
        getParams({
          manualSubjectIds: [1, 99],
          knownSubjects: new Map([[1, null]]),
        }),
      ),
    ).toEqual([{ subjectId: 1, sources: ["manual"], score: 0 }]);
  });

  it("ignores the sources that are not enabled", () => {
    expect(
      getPooledLeeches(
        getParams({
          enabledSources: ["manual"],
          statisticalScores: new Map([[1, 5]]),
          manualSubjectIds: [2],
          confusionGroups: [[3, 4]],
          curatedGroups: [[4, 5]],
        }),
      ),
    ).toEqual([{ subjectId: 2, sources: ["manual"], score: 0 }]);
  });

  it("contributes nothing when no source is enabled", () => {
    const enabledSources: LeechSource[] = [];

    expect(
      getPooledLeeches(
        getParams({ enabledSources, statisticalScores: new Map([[1, 5]]) }),
      ),
    ).toEqual([]);
  });
});
