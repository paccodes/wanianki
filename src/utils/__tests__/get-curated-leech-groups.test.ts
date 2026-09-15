import { describe, expect, it } from "vitest";

import type { CuratedLeechGroup } from "../../types";

import { getCuratedLeechGroups } from "../get-curated-leech-groups";

const groups: CuratedLeechGroup[] = [
  { listId: "look-alike", subjectIds: [1, 2] },
  { listId: "look-alike", subjectIds: [3, 4] },
  { listId: "homophone", subjectIds: [5, 6] },
];

describe("getCuratedLeechGroups", () => {
  it("returns nothing when no list is enabled", () => {
    expect(
      getCuratedLeechGroups({
        groups,
        enabledListIds: [],
        scope: "all",
        strugglingSubjectIds: new Set([1]),
      }),
    ).toEqual([]);
  });

  it("keeps only the groups of the enabled lists", () => {
    expect(
      getCuratedLeechGroups({
        groups,
        enabledListIds: ["homophone"],
        scope: "all",
        strugglingSubjectIds: new Set(),
      }),
    ).toEqual([[5, 6]]);
  });

  it("ignores struggling items when the scope is all", () => {
    expect(
      getCuratedLeechGroups({
        groups,
        enabledListIds: ["look-alike", "homophone"],
        scope: "all",
        strugglingSubjectIds: new Set(),
      }),
    ).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("keeps only the groups holding a struggling item", () => {
    expect(
      getCuratedLeechGroups({
        groups,
        enabledListIds: ["look-alike", "homophone"],
        scope: "struggling",
        strugglingSubjectIds: new Set([3]),
      }),
    ).toEqual([[3, 4]]);
  });

  it("keeps the whole group of a struggling item", () => {
    expect(
      getCuratedLeechGroups({
        groups,
        enabledListIds: ["look-alike"],
        scope: "struggling",
        strugglingSubjectIds: new Set([2]),
      }),
    ).toEqual([[1, 2]]);
  });

  it("keeps groups sharing a subject apart from one another", () => {
    expect(
      getCuratedLeechGroups({
        groups: [
          { listId: "look-alike", subjectIds: [1, 2] },
          { listId: "homophone", subjectIds: [2, 3] },
        ],
        enabledListIds: ["look-alike", "homophone"],
        scope: "all",
        strugglingSubjectIds: new Set(),
      }),
    ).toEqual([
      [1, 2],
      [2, 3],
    ]);
  });
});
