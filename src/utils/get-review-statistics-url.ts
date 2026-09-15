import { getSubjectTypesQueryParameter } from "./get-subject-types-query-parameter";

export const getReviewStatisticsUrl = (): string =>
  `/review_statistics?subject_types=${getSubjectTypesQueryParameter()}&hidden=false`;
