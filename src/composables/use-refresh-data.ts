import { ref, type Ref } from "vue";

import {
  getKanjiCollection,
  getRadicalCollection,
  getUserReport,
  getVocabularyCollection,
} from "../api";
import { USER_KEY } from "../storage-keys";
import type {
  Kanji,
  Radical,
  SubjectResponse,
  User,
  Vocabulary,
} from "../types";
import {
  fetchAllPages,
  getErrorMessage,
  getSortedByIdAndLevel,
} from "../utils";

import { subjectCollection } from "./use-learning-material";
import { apiToken, user } from "./use-login";
import { useNotifications } from "./use-notifications";
import { useOpfsStorage } from "./use-opfs-storage";
import { useSrsStages } from "./use-srs-stages";

interface ReturnValue {
  isRefreshing: Ref<boolean>;
  refresh: (inputApiKey: string) => Promise<void>;
}

export const useRefreshData = (): ReturnValue => {
  const { addNotification } = useNotifications();

  const { setValue: setUser } = useOpfsStorage<User, "report">(USER_KEY);

  const { fetchAndMergeSrsStages } = useSrsStages();

  const isRefreshing = ref<boolean>(false);

  const refresh = async (inputApiKey: string) => {
    if (!user.value) {
      addNotification("No user data available", "error");

      return;
    }

    apiToken.value = inputApiKey;
    isRefreshing.value = true;

    try {
      const oldLevel = user.value.level;

      const { data: userResponse } = await getUserReport();
      const newUserData = userResponse.data;
      const newLevel = newUserData.level;

      if (newLevel > oldLevel) {
        const startLevel = oldLevel + 1;
        const endLevel = newLevel;

        const [
          newKanjiCollection,
          newRadicalCollection,
          newVocabularyCollection,
        ] = await Promise.all([
          fetchAllPages<SubjectResponse<Kanji>, "collection">(
            getKanjiCollection(startLevel, endLevel),
          ),
          fetchAllPages<SubjectResponse<Radical>, "collection">(
            getRadicalCollection(startLevel, endLevel),
          ),
          fetchAllPages<SubjectResponse<Vocabulary>, "collection">(
            getVocabularyCollection(startLevel, endLevel),
          ),
        ]);

        subjectCollection.kanji.value = getSortedByIdAndLevel([
          ...subjectCollection.kanji.value,
          ...newKanjiCollection,
        ]);
        subjectCollection.radical.value = getSortedByIdAndLevel([
          ...subjectCollection.radical.value,
          ...newRadicalCollection,
        ]);
        subjectCollection.vocabulary.value = getSortedByIdAndLevel([
          ...subjectCollection.vocabulary.value,
          ...newVocabularyCollection,
        ]);
      }

      await fetchAndMergeSrsStages(newLevel);

      user.value = newUserData;
      await setUser(newUserData);

      if (newLevel > oldLevel) {
        addNotification(
          `Leveled up to ${newLevel}! Subjects and assignments data synced`,
          "success",
        );
      } else {
        addNotification("Assignments data synced", "success");
      }
    } catch (error) {
      addNotification(
        getErrorMessage(error, "Failed to refresh data"),
        "error",
      );
    } finally {
      apiToken.value = null;
      isRefreshing.value = false;
    }
  };

  return { isRefreshing, refresh };
};
