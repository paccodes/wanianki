import { describe, expect, it } from "vitest";

import { getSortedByIdAndLevel } from "../get-sorted-by-id-and-level";

describe("getSortedByIdAndLevel", () => {
  it("returns a new array (does not mutate the original)", () => {
    const original = [
      { id: 2, data: { level: 1 } },
      { id: 1, data: { level: 1 } },
    ];
    const originalCopy = JSON.stringify(original);
    const sorted = getSortedByIdAndLevel(original);

    expect(JSON.stringify(original)).toBe(originalCopy);
    expect(sorted).not.toBe(original);
  });

  it("sorts by level first, then by id", () => {
    const items = [
      { id: 3, data: { level: 2 } },
      { id: 1, data: { level: 1 } },
      { id: 2, data: { level: 2 } },
      { id: 4, data: { level: 1 } },
    ];
    const sorted = getSortedByIdAndLevel(items);

    expect(sorted).toEqual([
      { id: 1, data: { level: 1 } },
      { id: 4, data: { level: 1 } },
      { id: 2, data: { level: 2 } },
      { id: 3, data: { level: 2 } },
    ]);
  });

  it("handles empty arrays", () => {
    expect(getSortedByIdAndLevel([])).toEqual([]);
  });

  it("handles single-element arrays", () => {
    const item = { id: 1, data: { level: 1 } };

    expect(getSortedByIdAndLevel([item])).toEqual([item]);
  });

  it("handles already sorted arrays", () => {
    const items = [
      { id: 1, data: { level: 1 } },
      { id: 2, data: { level: 1 } },
      { id: 3, data: { level: 2 } },
    ];

    expect(getSortedByIdAndLevel(items)).toEqual(items);
  });

  it("handles items with same level sorted by id", () => {
    const items = [
      { id: 5, data: { level: 1 } },
      { id: 3, data: { level: 1 } },
      { id: 1, data: { level: 1 } },
    ];
    const sorted = getSortedByIdAndLevel(items);

    expect(sorted).toEqual([
      { id: 1, data: { level: 1 } },
      { id: 3, data: { level: 1 } },
      { id: 5, data: { level: 1 } },
    ]);
  });

  it("handles items with same id sorted by level", () => {
    const items = [
      { id: 1, data: { level: 3 } },
      { id: 1, data: { level: 1 } },
      { id: 1, data: { level: 2 } },
    ];
    const sorted = getSortedByIdAndLevel(items);

    expect(sorted).toEqual([
      { id: 1, data: { level: 1 } },
      { id: 1, data: { level: 2 } },
      { id: 1, data: { level: 3 } },
    ]);
  });

  it("preserves additional properties on items", () => {
    const items = [
      { id: 2, data: { level: 1, name: "B" } },
      { id: 1, data: { level: 1, name: "A" } },
    ];
    const sorted = getSortedByIdAndLevel(items);

    expect(sorted).toHaveLength(2);
    expect(sorted[0]!.data.name).toBe("A");
    expect(sorted[1]!.data.name).toBe("B");
  });
});
