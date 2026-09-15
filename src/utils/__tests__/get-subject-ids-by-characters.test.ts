import { describe, expect, it } from "vitest";

import type { Kanji, ReviewSubject } from "../../types";

import { getSubjectIdsByCharacters } from "../get-subject-ids-by-characters";

const getKanji = (id: number, characters: string | null): ReviewSubject =>
  ({
    id,
    object: "kanji",
    data: { characters, level: 1 } as Kanji,
  }) as ReviewSubject;

describe("getSubjectIdsByCharacters", () => {
  it("returns an empty index when no subject is given", () => {
    expect(getSubjectIdsByCharacters([])).toEqual(new Map());
  });

  it("indexes each subject under its characters", () => {
    expect(
      getSubjectIdsByCharacters([getKanji(1, "土"), getKanji(2, "士")]),
    ).toEqual(
      new Map([
        ["土", [1]],
        ["士", [2]],
      ]),
    );
  });

  it("skips subjects without characters", () => {
    expect(
      getSubjectIdsByCharacters([getKanji(1, null), getKanji(2, "土")]),
    ).toEqual(new Map([["土", [2]]]));
  });
});
