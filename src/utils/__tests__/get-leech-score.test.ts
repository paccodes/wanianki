import { describe, expect, it } from "vitest";

import { getLeechScore } from "../get-leech-score";

describe("getLeechScore", () => {
  it("returns 0 when there is no incorrect answer", () => {
    expect(getLeechScore(0, 0)).toBe(0);
    expect(getLeechScore(0, 5)).toBe(0);
  });

  it("treats a streak below 1 as a streak of 1", () => {
    expect(getLeechScore(3, 0)).toBe(3);
    expect(getLeechScore(3, 1)).toBe(3);
  });

  it("returns the incorrect count divided by the streak raised to 1.5", () => {
    expect(getLeechScore(8, 4)).toBe(1);
    expect(getLeechScore(2, 4)).toBe(0.25);
  });

  it("decreases as the streak grows", () => {
    expect(getLeechScore(6, 2)).toBeGreaterThan(getLeechScore(6, 6));
  });

  it("increases with the number of incorrect answers", () => {
    expect(getLeechScore(9, 3)).toBeGreaterThan(getLeechScore(3, 3));
  });

  it("ignores negative incorrect counts", () => {
    expect(getLeechScore(-2, 3)).toBe(0);
  });
});
