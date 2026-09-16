import { QUIZ_MODE_KEY, SHUFFLE_KEY } from "../storage-keys";

import { useLocalStorage } from "./use-local-storage";

export const shouldShuffle = useLocalStorage<boolean>(SHUFFLE_KEY, false);
export const isQuizMode = useLocalStorage<boolean>(QUIZ_MODE_KEY, false);
