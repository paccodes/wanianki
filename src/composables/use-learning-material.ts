import { computed, type ComputedRef, shallowRef, type ShallowRef } from "vue";

import {
  getKanjiCollection,
  getRadicalCollection,
  getVocabularyCollection,
} from "../api";
import { KANJI_KEY, RADICAL_KEY, VOCABULARY_KEY } from "../storage-keys";
import type {
  Kanji,
  Radical,
  SubjectResponse,
  SubjectResponseWithSrsStage,
  Vocabulary,
} from "../types";

import { useFetch } from "./use-fetch";
import { apiToken } from "./use-login";
import { useNotifications } from "./use-notifications";
import { useSrsStages } from "./use-srs-stages";

const FIRST_LEVEL = 1;
const SUBJECT_TYPE_COUNT = 3;

const [kanjiCollection, radicalCollection, vocabularyCollection] = [
  shallowRef<SubjectResponseWithSrsStage<Kanji>[]>([]),
  shallowRef<SubjectResponseWithSrsStage<Radical>[]>([]),
  shallowRef<SubjectResponseWithSrsStage<Vocabulary>[]>([]),
];

export const subjectCollection = {
  kanji: kanjiCollection,
  radical: radicalCollection,
  vocabulary: vocabularyCollection,
};

export const useLearningMaterial = (
  userLevel: number,
): ComputedRef<boolean> => {
  const { addNotification } = useNotifications();
  const { isMerging, fetchAndMergeSrsStages } = useSrsStages();

  let completedCount = 0;

  const onCompleteFactory =
    <T>(collection: ShallowRef<SubjectResponseWithSrsStage<T>[]>) =>
    (data: SubjectResponse<T>[] | null) => {
      if (data) {
        collection.value = data;
      }

      completedCount++;

      if (completedCount === SUBJECT_TYPE_COUNT && apiToken.value) {
        fetchAndMergeSrsStages(userLevel).then(() => {
          addNotification("Assignments successfully loaded", "success");
        });
      }
    };

  const { isLoading: isKanjiCollectionLoading } = useFetch<
    SubjectResponseWithSrsStage<Kanji>,
    "collection"
  >({
    storageKey: KANJI_KEY,
    errorMessage: "Failed to load kanjis",
    successMessage: "Kanjis successfully loaded",
    shouldFetchOnMounted: true,
    shouldSaveToOpfs: false,
    fetcher: getKanjiCollection(FIRST_LEVEL, userLevel),
    onComplete: onCompleteFactory(kanjiCollection),
  });

  const { isLoading: isRadicalCollectionLoading } = useFetch<
    SubjectResponseWithSrsStage<Radical>,
    "collection"
  >({
    storageKey: RADICAL_KEY,
    errorMessage: "Failed to load radicals",
    successMessage: "Radicals successfully loaded",
    shouldFetchOnMounted: true,
    shouldSaveToOpfs: false,
    fetcher: getRadicalCollection(FIRST_LEVEL, userLevel),
    onComplete: onCompleteFactory(radicalCollection),
  });

  const { isLoading: isVocabularyCollectionLoading } = useFetch<
    SubjectResponseWithSrsStage<Vocabulary>,
    "collection"
  >({
    storageKey: VOCABULARY_KEY,
    errorMessage: "Failed to load vocabulary",
    successMessage: "Vocabulary successfully loaded",
    shouldFetchOnMounted: true,
    shouldSaveToOpfs: false,
    fetcher: getVocabularyCollection(FIRST_LEVEL, userLevel),
    onComplete: onCompleteFactory(vocabularyCollection),
  });

  const isLoading = computed<boolean>(
    () =>
      isKanjiCollectionLoading.value ||
      isRadicalCollectionLoading.value ||
      isVocabularyCollectionLoading.value ||
      isMerging.value,
  );

  return isLoading;
};
