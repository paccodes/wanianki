import type { ReviewSubject } from "../types";

export const getSubjectIdsByCharacters = (
  subjects: ReviewSubject[],
): Map<string, number[]> => {
  const idsByCharacters = new Map<string, number[]>();

  for (const { id, data } of subjects) {
    if (!data.characters) {
      continue;
    }

    const ids = idsByCharacters.get(data.characters);

    if (ids) {
      ids.push(id);
    } else {
      idsByCharacters.set(data.characters, [id]);
    }
  }

  return idsByCharacters;
};
