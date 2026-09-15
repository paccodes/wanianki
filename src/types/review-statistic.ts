export interface ReviewStatistic {
  subject_id: number;
  meaning_incorrect: number;
  reading_incorrect: number;
  meaning_current_streak: number;
  reading_current_streak: number;
  percentage_correct: number;
}

export interface ReviewStatisticResponse {
  id: number;
  object: "review_statistic";
  data: ReviewStatistic;
}
