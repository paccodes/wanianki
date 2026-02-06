import type { AxiosResponse } from "axios";

import type {
  AssignmentResponse,
  Kanji,
  Radical,
  Response,
  SubjectResponse,
  User,
  Vocabulary,
} from "../types";
import { getAssignmentsUrl, getSubjectsUrl } from "../utils";

import { axiosClient } from "./axios-client";

const getResource = async <T>(
  url: string,
): Promise<AxiosResponse<Response<T>>> => axiosClient.get<Response<T>>(url);

export type Fetcher<T> = (
  url: string | null,
) => ReturnType<typeof getResource<T>>;

export function getUserReport() {
  return getResource<User>("/user");
}

export function getKanjiCollection(startLevel: number, endLevel: number) {
  return function (url: string | null) {
    return getResource<SubjectResponse<Kanji>>(
      url ?? getSubjectsUrl(startLevel, endLevel, "kanji"),
    );
  };
}

export function getRadicalCollection(startLevel: number, endLevel: number) {
  return function (url: string | null) {
    return getResource<SubjectResponse<Radical>>(
      url ?? getSubjectsUrl(startLevel, endLevel, "radical"),
    );
  };
}

export function getVocabularyCollection(startLevel: number, endLevel: number) {
  return function (url: string | null) {
    return getResource<SubjectResponse<Vocabulary>>(
      url ?? getSubjectsUrl(startLevel, endLevel, "vocabulary"),
    );
  };
}

export function getAssignmentCollection(startLevel: number, endLevel: number) {
  return function (url: string | null) {
    return getResource<AssignmentResponse>(
      url ?? getAssignmentsUrl(startLevel, endLevel),
    );
  };
}
