import { describe, expect, it } from "vitest";

import { getToggledArray } from "../get-toggled-array";

describe("getToggledArray", () => {
  it("appends a value that is absent", () => {
    expect(getToggledArray([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it("removes a value that is present", () => {
    expect(getToggledArray([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("removes every occurrence of a duplicated value", () => {
    expect(getToggledArray([1, 2, 1], 1)).toEqual([2]);
  });

  it("appends to an empty array", () => {
    expect(getToggledArray<string>([], "a")).toEqual(["a"]);
  });

  it("does not mutate the original array", () => {
    const values = [1, 2];

    getToggledArray(values, 3);

    expect(values).toEqual([1, 2]);
  });
});
