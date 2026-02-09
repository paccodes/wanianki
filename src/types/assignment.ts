export interface Assignment {
  subject_id: number;
  srs_stage: number;
}

export interface AssignmentResponse {
  id: number;
  object: "assignment";
  data: Assignment;
}

export type SrsStageFilter =
  | "locked"
  | "apprentice1"
  | "apprentice2"
  | "apprentice3"
  | "apprentice4"
  | "guru1"
  | "guru2"
  | "master"
  | "enlightened"
  | "burned";
