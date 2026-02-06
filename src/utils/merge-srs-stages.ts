import type {
  AssignmentResponse,
  SubjectResponse,
  SubjectResponseWithSrsStage,
} from "../types";

export const mergeSrsStages = <T>(
  subjects: SubjectResponse<T>[],
  assignments: AssignmentResponse[],
): SubjectResponseWithSrsStage<T>[] => {
  const srsStageMap = new Map<number, number>();

  for (const assignment of assignments) {
    srsStageMap.set(assignment.data.subject_id, assignment.data.srs_stage);
  }

  return subjects.map((subject) => ({
    ...subject,
    srs_stage: srsStageMap.get(subject.id),
  }));
};
