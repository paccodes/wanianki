export interface Assignment {
  subject_id: number;
  srs_stage: number;
}

export interface AssignmentResponse {
  id: number;
  object: "assignment";
  data: Assignment;
}
