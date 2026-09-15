import { describe, expect, it } from "vitest";

import type { LeechItem } from "../../types";

import { getSortedLeeches } from "../get-sorted-leeches";

const leech = (
  subjectId: number,
  sources: LeechItem["sources"],
  score = 0,
  groupId?: string,
): LeechItem => ({ subjectId, sources, score, groupId });

describe("getSortedLeeches", () => {
  it("returns an empty array unchanged", () => {
    expect(getSortedLeeches([])).toEqual([]);
  });

  it("returns a new array (does not mutate the original)", () => {
    const original = [
      leech(2, ["statistical"], 1),
      leech(1, ["statistical"], 5),
    ];
    const copy = JSON.stringify(original);
    const sortedLeeches = getSortedLeeches(original);

    expect(JSON.stringify(original)).toBe(copy);
    expect(sortedLeeches).not.toBe(original);
  });

  it("ranks manual leeches above every other source", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["curated"]),
      leech(2, ["statistical"], 9),
      leech(3, ["manual"]),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([3, 2, 1]);
  });

  it("keeps an unscored manual leech ahead of high-scoring statistical ones", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["statistical"], 8.5),
      leech(2, ["manual"], 0),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([2, 1]);
  });

  it("ranks scored leeches above unscored ones", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["confusion"]),
      leech(2, ["curated"]),
      leech(3, ["statistical"], 0.5),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([3, 1, 2]);
  });

  it("sorts by descending score within the same rank", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["statistical"], 2),
      leech(2, ["statistical"], 7),
      leech(3, ["statistical"], 4),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([2, 3, 1]);
  });

  it("sorts manual leeches by descending score, then by subject id", () => {
    const sortedLeeches = getSortedLeeches([
      leech(9, ["manual"], 0),
      leech(4, ["manual"], 0),
      leech(7, ["statistical", "manual"], 3),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([7, 4, 9]);
  });

  it("falls back to subject id when rank and score are equal", () => {
    const sortedLeeches = getSortedLeeches([
      leech(30, ["curated"]),
      leech(10, ["curated"]),
      leech(20, ["curated"]),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([
      10, 20, 30,
    ]);
  });

  it("keeps the members of a group adjacent", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["confusion"], 0, "confusion:0"),
      leech(2, ["statistical"], 5),
      leech(3, ["confusion", "statistical"], 9, "confusion:0"),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([3, 1, 2]);
  });

  it("places a group by its strongest member", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["curated"], 0, "curated:0"),
      leech(2, ["curated", "statistical"], 2, "curated:0"),
      leech(3, ["statistical"], 6),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([3, 2, 1]);
  });

  it("pulls a whole group to the top when one member is manual", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["statistical"], 8),
      leech(2, ["confusion"], 0, "confusion:0"),
      leech(3, ["confusion", "manual"], 0, "confusion:0"),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([3, 2, 1]);
  });

  it("keeps distinct groups apart from one another", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["curated"], 0, "curated:0"),
      leech(2, ["curated"], 0, "curated:1"),
      leech(3, ["curated"], 0, "curated:0"),
      leech(4, ["curated"], 0, "curated:1"),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([
      1, 3, 2, 4,
    ]);
  });

  it("orders the members of a group among themselves", () => {
    const sortedLeeches = getSortedLeeches([
      leech(30, ["confusion"], 0, "confusion:0"),
      leech(10, ["confusion"], 0, "confusion:0"),
      leech(20, ["confusion", "statistical"], 4, "confusion:0"),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([
      20, 10, 30,
    ]);
  });

  it("sorts ungrouped leeches by rank, then score, then subject id", () => {
    const sortedLeeches = getSortedLeeches([
      leech(1, ["curated"]),
      leech(2, ["statistical"], 3),
      leech(3, ["manual"]),
      leech(4, ["statistical"], 7),
    ]);

    expect(sortedLeeches.map(({ subjectId }) => subjectId)).toEqual([
      3, 4, 2, 1,
    ]);
  });
});
