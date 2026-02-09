import { describe, it, expect } from "vitest";

import { getShuffledArray } from "../get-shuffled-array";

describe("getShuffledArray", () => {
  it("returns a new array (does not mutate the original)", () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    const shuffled = getShuffledArray(original);

    expect(original).toEqual(originalCopy);
    expect(shuffled).not.toBe(original);
  });

  it("returns an array with the same elements", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = getShuffledArray(original);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.sort()).toEqual(original.sort());
  });

  it("handles empty arrays", () => {
    const result = getShuffledArray([]);

    expect(result).toEqual([]);
  });

  it("handles single-element arrays", () => {
    const result = getShuffledArray([1]);

    expect(result).toEqual([1]);
  });

  it("handles arrays with duplicate values", () => {
    const original = [1, 1, 2, 2, 3];
    const shuffled = getShuffledArray(original);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.sort()).toEqual(original.sort());
  });

  it("works with different types", () => {
    const strings = ["a", "b", "c"];
    const shuffledStrings = getShuffledArray(strings);

    expect(shuffledStrings.sort()).toEqual(strings.sort());

    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const shuffledObjects = getShuffledArray(objects);

    expect(shuffledObjects).toHaveLength(objects.length);

    objects.forEach((obj) => {
      expect(shuffledObjects).toContain(obj);
    });
  });

  it("produces different orderings (statistical test)", () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = new Set<string>();

    for (let i = 0; i < 20; i++) {
      results.add(getShuffledArray(original).join(","));
    }

    expect(results.size).toBeGreaterThan(1);
  });
});
