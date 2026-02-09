import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";

import { getUserReport } from "../api";
import { USER_KEY } from "../storage-keys";
import type { User } from "../types";
import { isSubscriptionValid } from "../utils";

import { useFetch } from "./use-fetch";
import { useNotifications } from "./use-notifications";
import { useOpfsStorage } from "./use-opfs-storage";

export const apiToken = ref<string | null>(null);

export const user = ref<User | null>(null);

const onComplete = (data: User | null) => {
  if (data) {
    user.value = data;
  }
};

interface ReturnValue {
  inputValue: Ref<string>;
  isLoading: Ref<boolean>;
  onSubmit: () => Promise<void>;
}

export const useLogin = (): ReturnValue => {
  const router = useRouter();

  const { addNotification } = useNotifications();

  const { setValue: setUser } = useOpfsStorage<User, "report">(USER_KEY);

  const { isLoading, refresh } = useFetch<User, "report">({
    storageKey: USER_KEY,
    errorMessage: "Failed to load user profile",
    successMessage: "Authenticated successfully",
    shouldFetchOnMounted: false,
    shouldSaveToOpfs: true,
    fetcher: getUserReport,
    onComplete,
  });

  const inputValue = ref<string>("");

  const onSubmit = async () => {
    apiToken.value = inputValue.value;

    try {
      const userData = await refresh();

      if (userData && !isSubscriptionValid(userData?.subscription)) {
        addNotification("But ouch, invalid user subscription", "error");

        await setUser(null);
      } else {
        user.value = userData;

        router.push("/");
      }
    } catch {
      apiToken.value = null;
    } finally {
      inputValue.value = "";
    }
  };

  return {
    inputValue,
    isLoading,
    onSubmit,
  };
};
