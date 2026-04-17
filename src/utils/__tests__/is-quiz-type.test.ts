import { describe, expect, it } from "vitest";

import { isQuizType } from "../is-quiz-type";

describe("isQuizType", () => {
  it("returns true for valid quiz types", () => {
    expect(isQuizType("meaning")).toBe(true);
    expect(isQuizType("reading")).toBe(true);
  });

  it("returns false for invalid quiz types", () => {
    expect(isQuizType("invalid")).toBe(false);
    expect(isQuizType("MEANING")).toBe(false);
    expect(isQuizType("Reading")).toBe(false);
    expect(isQuizType("quiz")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isQuizType(null)).toBe(false);
    expect(isQuizType(undefined)).toBe(false);
    expect(isQuizType(123)).toBe(false);
    expect(isQuizType({})).toBe(false);
    expect(isQuizType([])).toBe(false);
    expect(isQuizType(true)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isQuizType("")).toBe(false);
  });
});
