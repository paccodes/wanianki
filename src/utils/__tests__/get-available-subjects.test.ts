import { describe, expect, it } from "vitest";

import type { Kanji, ReviewSubject } from "../../types";

import { getAvailableSubjects } from "../get-available-subjects";

const getKanji = (id: number, srsStage?: number, level = 1): ReviewSubject =>
  ({
    id,
    object: "kanji",
    srs_stage: srsStage,
    data: { characters: "土", level } as Kanji,
  }) as ReviewSubject;

describe("getAvailableSubjects", () => {
  it("returns an empty array when no subject is given", () => {
    expect(getAvailableSubjects([])).toEqual([]);
  });

  it("keeps subjects with a started assignment", () => {
    const subjects = [getKanji(1, 1), getKanji(2, 9)];

    expect(getAvailableSubjects(subjects)).toEqual(subjects);
  });

  it("drops subjects sitting at the locked stage", () => {
    const availableSubject = getKanji(1, 1);
    const unavailableSubject = getKanji(2, 0);

    expect(
      getAvailableSubjects([availableSubject, unavailableSubject]),
    ).toEqual([availableSubject]);
  });

  it("drops subjects without an assignment", () => {
    const availableSubject = getKanji(1, 1);
    const unavailableSubject = getKanji(2);

    expect(
      getAvailableSubjects([availableSubject, unavailableSubject]),
    ).toEqual([availableSubject]);
  });

  it("keeps every subject when the collection holds no srs stage at all", () => {
    const subjects = [getKanji(1), getKanji(2)];

    expect(getAvailableSubjects(subjects)).toEqual(subjects);
  });

  it("drops subjects sitting above the user level", () => {
    const availableSubject = getKanji(1, 1, 3);
    const unavailableSubject = getKanji(2, 1, 4);

    expect(
      getAvailableSubjects([availableSubject, unavailableSubject], 3),
    ).toEqual([availableSubject]);
  });

  it("still applies the user level when no srs stage was ever merged", () => {
    const availableSubject = getKanji(1, undefined, 2);
    const unavailableSubject = getKanji(2, undefined, 5);

    expect(
      getAvailableSubjects([availableSubject, unavailableSubject], 2),
    ).toEqual([availableSubject]);
  });

  it("keeps every level when the user level is unknown", () => {
    const subjects = [getKanji(1, 1, 1), getKanji(2, 1, 60)];

    expect(getAvailableSubjects(subjects)).toEqual(subjects);
  });

  it("filters as soon as a single subject carries an srs stage", () => {
    const availableSubject = getKanji(1, 4);
    const unavailableSubject = getKanji(2);

    expect(
      getAvailableSubjects([availableSubject, unavailableSubject]),
    ).toEqual([availableSubject]);
  });
});
