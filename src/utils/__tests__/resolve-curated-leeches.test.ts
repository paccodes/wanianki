import { describe, expect, it } from "vitest";

import type { CuratedLeechList } from "../../types";

import { resolveCuratedLeeches } from "../resolve-curated-leeches";

const getIndex = (entries: [string, number[]][]) => new Map(entries);

const getList = (groups: string[][], id = "list"): CuratedLeechList => ({
  id,
  name: "List",
  groups,
});

const ALL_DRILLABLE_SUBJECTS = new Set([1, 2, 3, 4]);

describe("resolveCuratedLeeches", () => {
  it("returns an empty array when no list is given", () => {
    expect(
      resolveCuratedLeeches({
        lists: [],
        subjectIdsByCharacters: getIndex([["土", [1]]]),
        drillableSubjectIds: ALL_DRILLABLE_SUBJECTS,
      }),
    ).toEqual([]);
  });

  it("resolves characters to the matching subject ids", () => {
    expect(
      resolveCuratedLeeches({
        lists: [getList([["土", "士"]])],
        subjectIdsByCharacters: getIndex([
          ["土", [1]],
          ["士", [2]],
        ]),
        drillableSubjectIds: ALL_DRILLABLE_SUBJECTS,
      }),
    ).toEqual([{ listId: "list", subjectIds: [1, 2] }]);
  });

  it("ignores groups with fewer than two resolved characters", () => {
    expect(
      resolveCuratedLeeches({
        lists: [getList([["土", "士"]])],
        subjectIdsByCharacters: getIndex([["土", [1]]]),
        drillableSubjectIds: ALL_DRILLABLE_SUBJECTS,
      }),
    ).toEqual([]);
  });

  it("ignores characters missing from the collection", () => {
    expect(
      resolveCuratedLeeches({
        lists: [getList([["土", "士", "王"]])],
        subjectIdsByCharacters: getIndex([
          ["土", [1]],
          ["士", [2]],
        ]),
        drillableSubjectIds: ALL_DRILLABLE_SUBJECTS,
      }),
    ).toEqual([{ listId: "list", subjectIds: [1, 2] }]);
  });

  it("includes every subject sharing the same characters", () => {
    expect(
      resolveCuratedLeeches({
        lists: [getList([["土", "士"]])],
        subjectIdsByCharacters: getIndex([
          ["土", [1, 2]],
          ["士", [3]],
        ]),
        drillableSubjectIds: ALL_DRILLABLE_SUBJECTS,
      }),
    ).toEqual([{ listId: "list", subjectIds: [1, 2, 3] }]);
  });

  it("keeps groups separate and tags them with their list", () => {
    expect(
      resolveCuratedLeeches({
        lists: [
          getList([["大", "犬"]], "first"),
          getList([["大", "太"]], "second"),
        ],
        subjectIdsByCharacters: getIndex([
          ["大", [1]],
          ["犬", [2]],
          ["太", [3]],
        ]),
        drillableSubjectIds: ALL_DRILLABLE_SUBJECTS,
      }),
    ).toEqual([
      { listId: "first", subjectIds: [1, 2] },
      { listId: "second", subjectIds: [1, 3] },
    ]);
  });

  it("drops members the user cannot drill", () => {
    expect(
      resolveCuratedLeeches({
        lists: [getList([["土", "士"]])],
        subjectIdsByCharacters: getIndex([
          ["土", [1, 2]],
          ["士", [3]],
        ]),
        drillableSubjectIds: new Set([2, 3]),
      }),
    ).toEqual([{ listId: "list", subjectIds: [2, 3] }]);
  });

  it("drops a group left with a single drillable member", () => {
    expect(
      resolveCuratedLeeches({
        lists: [getList([["土", "士"]])],
        subjectIdsByCharacters: getIndex([
          ["土", [1]],
          ["士", [2]],
        ]),
        drillableSubjectIds: new Set([1]),
      }),
    ).toEqual([]);
  });
});
