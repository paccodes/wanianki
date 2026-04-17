import { describe, expect, it } from "vitest";

import { capitalize } from "../capitalize";

describe("capitalize", () => {
  it("capitalizes the first letter of a lowercase word", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
  });

  it("preserves already capitalized first letter", () => {
    expect(capitalize("Hello")).toBe("Hello");
    expect(capitalize("World")).toBe("World");
  });

  it("only capitalizes the first letter, leaving rest unchanged", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
    expect(capitalize("wORLD")).toBe("WORLD");
  });

  it("handles single character strings", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize("A")).toBe("A");
  });

  it("handles empty strings", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles strings starting with numbers or special characters", () => {
    expect(capitalize("123abc")).toBe("123abc");
    expect(capitalize("_test")).toBe("_test");
  });

  it("handles strings with spaces", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });
});
