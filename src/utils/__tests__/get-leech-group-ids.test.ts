import { describe, expect, it } from "vitest";

import { getLeechGroupIds } from "../get-leech-group-ids";

describe("getLeechGroupIds", () => {
  it("returns an empty array when there is no group", () => {
    expect(getLeechGroupIds([])).toEqual([]);
  });

  it("flattens the groups in order", () => {
    expect(
      getLeechGroupIds([
        [3, 1],
        [2, 5],
      ]),
    ).toEqual([3, 1, 2, 5]);
  });

  it("de-duplicates subjects shared by several groups", () => {
    expect(
      getLeechGroupIds([
        [1, 2],
        [2, 3],
        [3, 1],
      ]),
    ).toEqual([1, 2, 3]);
  });

  it("drops an empty group", () => {
    expect(getLeechGroupIds([[], [1]])).toEqual([1]);
  });
});
