import type { ReviewStatisticResponse } from "../types";

import { getLeechScore } from "./get-leech-score";

const LEECH_SCORE_THRESHOLD = 1;

export const getStatisticalLeechScores = (
  statistics: ReviewStatisticResponse[],
): Map<number, number> => {
  const scores = new Map<number, number>();

  for (const { data } of statistics) {
    const score = Math.max(
      getLeechScore(data.meaning_incorrect, data.meaning_current_streak),
      getLeechScore(data.reading_incorrect, data.reading_current_streak),
    );

    if (score >= LEECH_SCORE_THRESHOLD) {
      scores.set(data.subject_id, score);
    }
  }

  return scores;
};
