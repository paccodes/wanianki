import { describe, expect, it } from "vitest";

import { getDiceCoefficient } from "../get-dice-coefficient";

describe("getDiceCoefficient", () => {
  it("returns 1 for identical strings", () => {
    expect(getDiceCoefficient("night", "night")).toBe(1);
    expect(getDiceCoefficient("hello", "hello")).toBe(1);
  });

  it("returns 0 for strings shorter than 2 characters", () => {
    expect(getDiceCoefficient("a", "a")).toBe(0);
    expect(getDiceCoefficient("", "")).toBe(0);
    expect(getDiceCoefficient("a", "abc")).toBe(0);
    expect(getDiceCoefficient("abc", "a")).toBe(0);
  });

  it("returns 0 for completely different strings", () => {
    expect(getDiceCoefficient("abc", "xyz")).toBe(0);
  });

  it("handles case-insensitive comparison", () => {
    expect(getDiceCoefficient("Night", "night")).toBe(1);
    expect(getDiceCoefficient("HELLO", "hello")).toBe(1);
  });

  it("ignores whitespace differences", () => {
    expect(getDiceCoefficient("hello world", "helloworld")).toBe(1);
    expect(getDiceCoefficient("hello  world", "hello world")).toBe(1);
  });

  it("returns correct coefficient for similar strings", () => {
    const coefficient = getDiceCoefficient("night", "nacht");

    expect(coefficient).toBeGreaterThan(0);
    expect(coefficient).toBeLessThan(1);
  });

  it("returns higher coefficient for more similar strings", () => {
    const highSimilarity = getDiceCoefficient("night", "nighty");
    const lowSimilarity = getDiceCoefficient("night", "nacht");

    expect(highSimilarity).toBeGreaterThan(lowSimilarity);
  });

  it("handles repeated characters correctly", () => {
    expect(getDiceCoefficient("aaa", "aaa")).toBe(1);
  });

  it("is symmetric", () => {
    expect(getDiceCoefficient("night", "nacht")).toBe(
      getDiceCoefficient("nacht", "night"),
    );
    expect(getDiceCoefficient("hello", "world")).toBe(
      getDiceCoefficient("world", "hello"),
    );
  });

  it("returns coefficient above threshold for acceptable answer variations", () => {
    expect(getDiceCoefficient("electricity", "electrcity")).toBeGreaterThan(
      0.8,
    );
    expect(getDiceCoefficient("vocabulary", "vocabulry")).toBeGreaterThan(0.8);
  });

  it("shows transposition errors may fall below threshold", () => {
    const coefficient = getDiceCoefficient("mountain", "mountian");

    expect(coefficient).toBeGreaterThan(0.5);
    expect(coefficient).toBeLessThan(0.8);
  });
});
