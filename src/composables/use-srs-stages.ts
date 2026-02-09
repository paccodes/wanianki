import { ref, type Ref } from "vue";

import { getAssignmentCollection } from "../api";
import { KANJI_KEY, RADICAL_KEY, VOCABULARY_KEY } from "../storage-keys";
import type {
  AssignmentResponse,
  Kanji,
  Radical,
  SubjectResponseWithSrsStage,
  Vocabulary,
} from "../types";
import {
  fetchAllPages,
  getErrorMessage,
  getSortedByIdAndLevel,
  getSubjectsWithSrsStages,
} from "../utils";

import { subjectCollection } from "./use-learning-material";
import { useNotifications } from "./use-notifications";
import { useOpfsStorage } from "./use-opfs-storage";

const FIRST_LEVEL = 1;

interface ReturnValue {
  isMerging: Ref<boolean>;
  fetchAndMergeSrsStages: (userLevel: number) => Promise<void>;
}

export const useSrsStages = (): ReturnValue => {
  const { addNotification } = useNotifications();

  const { setValue: setKanji } = useOpfsStorage<
    SubjectResponseWithSrsStage<Kanji>,
    "collection"
  >(KANJI_KEY);
  const { setValue: setRadical } = useOpfsStorage<
    SubjectResponseWithSrsStage<Radical>,
    "collection"
  >(RADICAL_KEY);
  const { setValue: setVocabulary } = useOpfsStorage<
    SubjectResponseWithSrsStage<Vocabulary>,
    "collection"
  >(VOCABULARY_KEY);

  const isMerging = ref<boolean>(false);

  const fetchAndMergeSrsStages = async (userLevel: number) => {
    isMerging.value = true;

    try {
      const assignments = await fetchAllPages<AssignmentResponse, "collection">(
        getAssignmentCollection(FIRST_LEVEL, userLevel),
      );

      const { kanji, radical, vocabulary } = subjectCollection;

      const [
        kanjiCollectionWithSrs,
        radicalCollectionWithSrs,
        vocabularyCollectionWithSrs,
      ] = [
        getSortedByIdAndLevel(
          getSubjectsWithSrsStages(kanji.value, assignments),
        ),
        getSortedByIdAndLevel(
          getSubjectsWithSrsStages(radical.value, assignments),
        ),
        getSortedByIdAndLevel(
          getSubjectsWithSrsStages(vocabulary.value, assignments),
        ),
      ];

      kanji.value = kanjiCollectionWithSrs;
      radical.value = radicalCollectionWithSrs;
      vocabulary.value = vocabularyCollectionWithSrs;

      await Promise.all([
        setKanji(kanjiCollectionWithSrs),
        setRadical(radicalCollectionWithSrs),
        setVocabulary(vocabularyCollectionWithSrs),
      ]);
    } catch (error) {
      addNotification(
        getErrorMessage(error, "Failed to sync assignments data"),
        "error",
      );
    } finally {
      isMerging.value = false;
    }
  };

  return { isMerging, fetchAndMergeSrsStages };
};
