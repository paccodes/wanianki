import type { Fetcher } from "../api";
import type {
  CollectionResponse,
  Pagination,
  ReportOrCollection,
  ReportResponse,
  ResponseType,
  Sortable,
} from "../types";

import { getSortedByIdAndLevel } from "./get-sorted-by-id-and-level";

export const fetchAllPages = async <T, U extends ResponseType>(
  fetcher: Fetcher<T>,
): Promise<ReportOrCollection<T, U>> => {
  let result: T | T[] | null = null;
  let pages: Pagination = { next_url: null };

  do {
    const { data: responseData } = await fetcher(pages.next_url);

    if (responseData.object === "collection") {
      const collectionResponse = responseData as CollectionResponse<T>;

      pages = collectionResponse.pages;

      result =
        result === null
          ? collectionResponse.data
          : [...(result as T[]), ...collectionResponse.data];
    } else {
      result = (responseData as ReportResponse<T>).data;
    }
  } while (pages.next_url);

  if (Array.isArray(result)) {
    return getSortedByIdAndLevel(result as Sortable[]) as ReportOrCollection<
      T,
      U
    >;
  }

  return result as ReportOrCollection<T, U>;
};
