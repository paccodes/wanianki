import { describe, expect, it } from "vitest";

import type { ReviewStatistic, ReviewStatisticResponse } from "../../types";

import { getStatisticalLeechScores } from "../get-statistical-leech-scores";

const buildStatistic = (
  subjectId: number,
  statistic: Partial<ReviewStatistic> = {},
): ReviewStatisticResponse => ({
  id: subjectId,
  object: "review_statistic",
  data: {
    subject_id: subjectId,
    meaning_incorrect: 0,
    meaning_current_streak: 1,
    reading_incorrect: 0,
    reading_current_streak: 1,
    percentage_correct: 100,
    ...statistic,
  },
});

describe("getStatisticalLeechScores", () => {
  it("returns nothing when there is no statistic", () => {
    const statistics = [] as ReviewStatisticResponse[];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map());
  });

  it("ignores an item answered correctly", () => {
    const statistics = [buildStatistic(1)];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map());
  });

  it("keeps an item scoring above the threshold", () => {
    const statistics = [
      buildStatistic(1, { meaning_incorrect: 10, meaning_current_streak: 4 }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map([[1, 1.25]]));
  });

  it("keeps an item scoring exactly at the threshold", () => {
    const statistics = [
      buildStatistic(1, { meaning_incorrect: 27, meaning_current_streak: 9 }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map([[1, 1]]));
  });

  it("drops an item scoring below the threshold", () => {
    const statistics = [
      buildStatistic(1, { meaning_incorrect: 6, meaning_current_streak: 4 }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map());
  });

  it("keeps an item failing on its meaning alone", () => {
    const statistics = [
      buildStatistic(1, {
        meaning_incorrect: 5,
        meaning_current_streak: 1,
        reading_incorrect: 12,
        reading_current_streak: 20,
      }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map([[1, 5]]));
  });

  it("keeps an item failing on its reading alone", () => {
    const statistics = [
      buildStatistic(1, {
        meaning_incorrect: 1,
        meaning_current_streak: 30,
        reading_incorrect: 5,
        reading_current_streak: 1,
      }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map([[1, 5]]));
  });

  it("scores an item by its worse half", () => {
    const statistics = [
      buildStatistic(1, {
        meaning_incorrect: 4,
        meaning_current_streak: 1,
        reading_incorrect: 9,
        reading_current_streak: 1,
      }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map([[1, 9]]));
  });

  it("keeps every leech and drops every cleared item", () => {
    const statistics = [
      buildStatistic(1, { meaning_incorrect: 3, meaning_current_streak: 1 }),
      buildStatistic(2, { meaning_incorrect: 2, meaning_current_streak: 4 }),
      buildStatistic(3, { reading_incorrect: 6, reading_current_streak: 2 }),
    ];

    expect([...getStatisticalLeechScores(statistics).keys()]).toEqual([1, 3]);
  });

  it("keeps the last statistic when a subject is repeated", () => {
    const statistics = [
      buildStatistic(1, { meaning_incorrect: 3, meaning_current_streak: 1 }),
      buildStatistic(1, { meaning_incorrect: 8, meaning_current_streak: 1 }),
    ];

    expect(getStatisticalLeechScores(statistics)).toEqual(new Map([[1, 8]]));
  });
});
