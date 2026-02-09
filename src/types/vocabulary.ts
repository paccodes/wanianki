import type { Subject } from "./subject";

interface ContextSentence {
  en: string;
  ja: string;
}

interface Reading {
  accepted_answer: boolean;
  primary: boolean;
  reading: string;
}

export interface Vocabulary extends Subject {
  characters: string;
  component_subject_ids: number[];
  context_sentences: ContextSentence[];
  meaning_mnemonic: string;
  parts_of_speech: string[];
  reading_mnemonic: string;
  readings: Reading[];
}
