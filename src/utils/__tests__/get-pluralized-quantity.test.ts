import { describe, expect, it } from "vitest";

import { getPluralizedQuantity } from "../get-pluralized-quantity";

describe("getPluralizedQuantity", () => {
  it("returns singular form for amount of 1", () => {
    expect(getPluralizedQuantity("item", 1)).toBe("1 item");
    expect(getPluralizedQuantity("cat", 1)).toBe("1 cat");
  });

  it("returns plural form for amount of 0", () => {
    expect(getPluralizedQuantity("item", 0)).toBe("0 items");
    expect(getPluralizedQuantity("cat", 0)).toBe("0 cats");
  });

  it("returns plural form for amounts greater than 1", () => {
    expect(getPluralizedQuantity("item", 2)).toBe("2 items");
    expect(getPluralizedQuantity("item", 10)).toBe("10 items");
    expect(getPluralizedQuantity("item", 100)).toBe("100 items");
  });

  it("returns plural form for negative amounts", () => {
    expect(getPluralizedQuantity("item", -1)).toBe("-1 items");
    expect(getPluralizedQuantity("item", -5)).toBe("-5 items");
  });

  it("handles decimal amounts", () => {
    expect(getPluralizedQuantity("item", 1.5)).toBe("1.5 items");
    expect(getPluralizedQuantity("item", 0.5)).toBe("0.5 items");
  });
});
