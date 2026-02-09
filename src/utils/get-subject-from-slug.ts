import type { Subject, SubjectResponseWithSrsStage } from "../types";

export const getSubjectFromSlug = <T extends Subject>(
  slug: string,
  collection: SubjectResponseWithSrsStage<T>[],
): SubjectResponseWithSrsStage<T> | null =>
  collection.find((element) => element.data.slug === slug) ?? null;
