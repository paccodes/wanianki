import { toRomaji } from "wanakana";

import type {
  Kanji,
  ReviewSubject,
  SubjectResponseWithSrsStage,
  Vocabulary,
} from "../types";

export const getSubjectQueryString = (subject: ReviewSubject): string => {
  const meanings = subject.data.meanings.map(({ meaning }) =>
    meaning.toLowerCase(),
  );

  const readings =
    subject.object === "radical"
      ? ""
      : (
          subject as SubjectResponseWithSrsStage<Kanji | Vocabulary>
        ).data.readings.map(({ reading }) => toRomaji(reading));

  return [...meanings, ...readings].join(" ");
};
