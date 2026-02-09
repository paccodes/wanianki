import type { Kanji } from "./kanji";
import type { Radical } from "./radical";
import type { Vocabulary } from "./vocabulary";

export type SubjectType = "kanji" | "radical" | "vocabulary";

interface Meaning {
  accepted_answer: boolean;
  meaning: string;
  primary: boolean;
}

export interface Subject {
  level: number;
  meaning_mnemonic: string;
  meanings: Meaning[];
  slug: string;
}

export interface SubjectResponse<T> {
  id: number;
  object: SubjectType;
  data: T;
}

export interface SubjectResponseWithSrsStage<T> extends SubjectResponse<T> {
  srs_stage?: number;
}

export type ReviewSubject = SubjectResponseWithSrsStage<
  Radical | Kanji | Vocabulary
>;
