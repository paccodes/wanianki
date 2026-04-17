import { ref, type Ref, watch } from "vue";

import { useNotifications } from "./use-notifications";

const { addNotification } = useNotifications();

const getValue = <T>(key: string, defaultValue: T) => {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    addNotification("Failed to parse data in local storage", "error");

    return defaultValue;
  }
};

const setValue = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const useLocalStorage = <T>(key: string, defaultValue: T): Ref<T> => {
  const value = ref<T>(getValue(key, defaultValue)) as Ref<T>;

  watch(
    value,
    (newValue) => {
      setValue(key, newValue);
    },
    { deep: true },
  );

  return value;
};
