import type { Subject } from "./subject";

export interface Reading {
  accepted_answer: boolean;
  primary: boolean;
  reading: string;
  type: "kunyomi" | "nanori" | "onyomi";
}

export interface Kanji extends Subject {
  characters: string;
  component_subject_ids: number[];
  meaning_hint: string | null;
  reading_hint: string | null;
  reading_mnemonic: string;
  readings: Reading[];
}
