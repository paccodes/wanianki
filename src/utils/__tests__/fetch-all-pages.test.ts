import { describe, expect, it, vi } from "vitest";

import { fetchAllPages } from "../fetch-all-pages";

type TestItem = { id: number; data: { level: number; name: string } };

const getCollectionFetcher = (
  pages: { data: TestItem[]; next_url: string | null }[],
) => {
  let callIndex = 0;

  return vi.fn().mockImplementation(() => {
    const page = pages[callIndex]!;
    callIndex++;

    return Promise.resolve({
      data: {
        object: "collection",
        pages: { next_url: page.next_url },
        data: page.data,
      },
    });
  });
};

const getReportFetcher = <T>(reportData: T) => {
  return vi.fn().mockImplementation(() => {
    return Promise.resolve({
      data: {
        object: "report",
        data: reportData,
      },
    });
  });
};

describe("fetchAllPages", () => {
  describe("collection responses", () => {
    it("fetches single page when no next_url", async () => {
      const items: TestItem[] = [
        { id: 1, data: { level: 1, name: "A" } },
        { id: 2, data: { level: 1, name: "B" } },
      ];

      const fetcher = getCollectionFetcher([{ data: items, next_url: null }]);

      const result = await fetchAllPages<TestItem, "collection">(fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(fetcher).toHaveBeenCalledWith(null);
      expect(result).toEqual(items);
    });

    it("fetches multiple pages and accumulates results", async () => {
      const page1Items: TestItem[] = [
        { id: 1, data: { level: 1, name: "A" } },
        { id: 2, data: { level: 1, name: "B" } },
      ];
      const page2Items: TestItem[] = [
        { id: 3, data: { level: 1, name: "C" } },
        { id: 4, data: { level: 1, name: "D" } },
      ];

      const fetcher = getCollectionFetcher([
        { data: page1Items, next_url: "https://api.example.com/page2" },
        { data: page2Items, next_url: null },
      ]);

      const result = await fetchAllPages<TestItem, "collection">(fetcher);

      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(fetcher).toHaveBeenNthCalledWith(1, null);
      expect(fetcher).toHaveBeenNthCalledWith(
        2,
        "https://api.example.com/page2",
      );
      expect(result).toHaveLength(4);
    });

    it("fetches three pages correctly", async () => {
      const page1Items: TestItem[] = [{ id: 1, data: { level: 1, name: "A" } }];
      const page2Items: TestItem[] = [{ id: 2, data: { level: 1, name: "B" } }];
      const page3Items: TestItem[] = [{ id: 3, data: { level: 1, name: "C" } }];

      const fetcher = getCollectionFetcher([
        { data: page1Items, next_url: "page2" },
        { data: page2Items, next_url: "page3" },
        { data: page3Items, next_url: null },
      ]);

      const result = await fetchAllPages<TestItem, "collection">(fetcher);

      expect(fetcher).toHaveBeenCalledTimes(3);
      expect(fetcher).toHaveBeenNthCalledWith(1, null);
      expect(fetcher).toHaveBeenNthCalledWith(2, "page2");
      expect(fetcher).toHaveBeenNthCalledWith(3, "page3");
      expect(result).toHaveLength(3);
    });

    it("returns results sorted by level then id", async () => {
      const items: TestItem[] = [
        { id: 5, data: { level: 2, name: "E" } },
        { id: 1, data: { level: 1, name: "A" } },
        { id: 3, data: { level: 2, name: "C" } },
        { id: 2, data: { level: 1, name: "B" } },
      ];

      const fetcher = getCollectionFetcher([{ data: items, next_url: null }]);

      const result = await fetchAllPages<TestItem, "collection">(fetcher);

      expect(result).toEqual([
        { id: 1, data: { level: 1, name: "A" } },
        { id: 2, data: { level: 1, name: "B" } },
        { id: 3, data: { level: 2, name: "C" } },
        { id: 5, data: { level: 2, name: "E" } },
      ]);
    });

    it("handles empty response", async () => {
      const items: TestItem[] = [];

      const fetcher = getCollectionFetcher([{ data: items, next_url: null }]);

      const result = await fetchAllPages<TestItem, "collection">(fetcher);

      expect(result).toEqual([]);
    });
  });

  describe("report responses", () => {
    it("fetches single report data", async () => {
      const data = { username: "test_user", level: 5 };

      const fetcher = getReportFetcher(data);

      const result = await fetchAllPages<typeof data, "report">(fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(fetcher).toHaveBeenCalledWith(null);
      expect(result).toEqual(data);
    });

    it("returns report data without modification", async () => {
      const data = {
        id: 123,
        nested: { value: "test" },
        array: [1, 2, 3],
      };

      const fetcher = getReportFetcher(data);

      const result = await fetchAllPages<typeof data, "report">(fetcher);

      expect(result).toEqual(data);
    });
  });

  describe("error handling", () => {
    it("propagates errors from fetcher", async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        fetchAllPages<TestItem, "collection">(fetcher),
      ).rejects.toThrow("Network error");
    });
  });
});
