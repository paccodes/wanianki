import { ref, type Ref } from "vue";

import {
  KANJI_KEY,
  RADICAL_KEY,
  REVIEW_STATISTICS_KEY,
  USER_KEY,
  VOCABULARY_KEY,
} from "../storage-keys";
import type {
  Kanji,
  Radical,
  ReviewStatisticResponse,
  User,
  Vocabulary,
} from "../types";

import { user } from "./use-login";
import { useNotifications } from "./use-notifications";
import { useOpfsStorage } from "./use-opfs-storage";

interface ReturnValue {
  isLoading: Ref<boolean>;
  cleanUpData: ({
    onSuccess,
    onComplete,
  }: {
    onSuccess?: () => void;
    onComplete?: () => void;
  }) => Promise<void>;
}

export const useDataCleanup = (): ReturnValue => {
  const isLoading = ref<boolean>(false);

  const { addNotification } = useNotifications();

  const [
    { setValue: setUser },
    { setValue: setKanji },
    { setValue: setRadical },
    { setValue: setVocabulary },
    { setValue: setReviewStatistics },
  ] = [
    useOpfsStorage<User, "report">(USER_KEY),
    useOpfsStorage<Kanji, "collection">(KANJI_KEY),
    useOpfsStorage<Radical, "collection">(RADICAL_KEY),
    useOpfsStorage<Vocabulary, "collection">(VOCABULARY_KEY),
    useOpfsStorage<ReviewStatisticResponse, "collection">(
      REVIEW_STATISTICS_KEY,
    ),
  ];

  const cleanUpData = async ({
    onSuccess,
    onComplete,
  }: {
    onSuccess?: () => void;
    onComplete?: () => void;
  }) => {
    isLoading.value = true;

    try {
      await Promise.all([
        setUser(null),
        setKanji(null),
        setRadical(null),
        setVocabulary(null),
        setReviewStatistics(null),
      ]);

      user.value = null;

      onSuccess?.();
    } catch (error) {
      addNotification((error as Error).message, "error");
    } finally {
      isLoading.value = false;

      onComplete?.();
    }
  };

  return {
    isLoading,
    cleanUpData,
  };
};
