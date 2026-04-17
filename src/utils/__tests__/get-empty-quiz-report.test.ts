import { describe, expect, it } from "vitest";

import { getEmptyQuizReport } from "../get-empty-quiz-report";

describe("getEmptyQuizReport", () => {
  it("returns an object with all subject types", () => {
    const report = getEmptyQuizReport();

    expect(report).toHaveProperty("radical");
    expect(report).toHaveProperty("kanji");
    expect(report).toHaveProperty("vocabulary");
  });

  it("returns an object with all quiz types for each subject type", () => {
    const report = getEmptyQuizReport();

    expect(report.radical).toHaveProperty("meaning");
    expect(report.radical).toHaveProperty("reading");
    expect(report.kanji).toHaveProperty("meaning");
    expect(report.kanji).toHaveProperty("reading");
    expect(report.vocabulary).toHaveProperty("meaning");
    expect(report.vocabulary).toHaveProperty("reading");
  });

  it("initializes all counters to zero", () => {
    const report = getEmptyQuizReport();

    const subjectTypes = ["radical", "kanji", "vocabulary"] as const;
    const quizTypes = ["meaning", "reading"] as const;

    subjectTypes.forEach((subjectType) => {
      quizTypes.forEach((quizType) => {
        expect(report[subjectType][quizType].correct).toBe(0);
        expect(report[subjectType][quizType].total).toBe(0);
      });
    });
  });

  it("returns a new object on each call", () => {
    const report1 = getEmptyQuizReport();
    const report2 = getEmptyQuizReport();

    expect(report1).not.toBe(report2);
    expect(report1.radical).not.toBe(report2.radical);
  });
});
