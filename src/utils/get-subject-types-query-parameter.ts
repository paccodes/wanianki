import type { SubjectType } from "../types";

const SUBJECT_TYPES: SubjectType[] = ["kanji", "radical", "vocabulary"];

export const getSubjectTypesQueryParameter = (): string =>
  SUBJECT_TYPES.join(",");
