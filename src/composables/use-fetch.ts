import { onMounted, ref, type Ref } from "vue";

import type { Fetcher } from "../api";
import type { ReportOrCollection, ResponseType } from "../types";
import { fetchAllPages, getErrorMessage } from "../utils";

import { useNotifications } from "./use-notifications";
import { useOpfsStorage } from "./use-opfs-storage";

interface Params<T, U extends ResponseType> {
  storageKey: string;
  errorMessage: string;
  successMessage: string;
  shouldFetchOnMounted: boolean;
  shouldSaveToOpfs: boolean;
  fetcher: Fetcher<T>;
  onComplete?: (data: ReportOrCollection<T, U> | null) => void;
}

interface ReturnValue<T, U extends ResponseType> {
  isLoading: Ref<boolean>;
  refresh: () => Promise<ReportOrCollection<T, U> | null>;
}

export const useFetch = <T, U extends ResponseType>({
  storageKey,
  errorMessage,
  successMessage,
  shouldFetchOnMounted,
  shouldSaveToOpfs,
  fetcher,
  onComplete,
}: Params<T, U>): ReturnValue<T, U> => {
  const { addNotification } = useNotifications();
  const { getValue, setValue } = useOpfsStorage<T, U>(storageKey);

  const isLoading = ref<boolean>(false);

  const data: { value: ReportOrCollection<T, U> | null } = {
    value: null,
  };

  onMounted(async () => {
    isLoading.value = true;
    data.value = (await getValue())?.data ?? null;

    if (shouldFetchOnMounted && data.value === null) {
      await refresh();
    }

    if (onComplete) {
      onComplete(data.value);
    }

    isLoading.value = false;
  });

  const refresh = async () => {
    try {
      data.value = await fetchAllPages<T, U>(fetcher);

      if (shouldSaveToOpfs) {
        await setValue(data.value);
      }

      addNotification(successMessage, "success");
    } catch (error) {
      addNotification(getErrorMessage(error, errorMessage), "error");
    }

    return data.value;
  };

  return { isLoading, refresh };
};
