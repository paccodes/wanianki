import type { ReviewSubject } from "./subject";

export type LeechSource = "statistical" | "manual" | "confusion" | "curated";

export type CuratedLeechScope = "struggling" | "all";

export interface LeechItem {
  subjectId: number;
  sources: LeechSource[];
  score: number;
  groupId?: string;
}

export interface Leech extends LeechItem {
  subject: ReviewSubject;
}

export interface CuratedLeechList {
  id: string;
  name: string;
  description?: string;
  groups: string[][];
}

export interface CuratedLeechGroup {
  listId: string;
  subjectIds: number[];
}

export interface LeechFilters {
  sources: LeechSource[];
  curatedListIds: string[];
  curatedScope: CuratedLeechScope;
}
