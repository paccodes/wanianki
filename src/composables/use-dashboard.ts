import { computed, type ComputedRef, ref, type Ref } from "vue";

import type { ReviewSubject } from "../types";

import { user } from "./use-login";
import { useQuizReport } from "./use-quiz-report";
import { useReviewSelection } from "./use-review-selection";

interface ReturnValue {
  loadedDeckId: Ref<string | null>;
  level: ComputedRef<number | undefined>;
  selectedSubjectIds: Ref<Set<number>>;
  selectedSubjects: ComputedRef<ReviewSubject[]>;
  shouldShuffle: Ref<boolean>;
  isQuizMode: Ref<boolean>;
  isLoading: ComputedRef<boolean>;
  canReview: ComputedRef<boolean>;
  handleLoadDeck: (deckId: string | null, subjectIds: number[]) => void;
  handleLoadLeeches: (subjectIds: number[]) => void;
  handleSaveDeck: (name: string) => void;
  handleAddSubjectId: (id: number) => void;
  handleDeleteSubjectId: (id: number) => void;
  handleClearSubjectIds: () => void;
  handleStartReview: () => void;
}

export const useDashboard = (
  saveDeck: (name: string, subjectIds: number[]) => void,
): ReturnValue => {
  const { resetQuizReport, setSourceDeckId } = useQuizReport();

  const loadedDeckId = ref<string | null>(null);

  const level = computed<number | undefined>(() => user.value?.level);

  const {
    selectedSubjectIds,
    selectedSubjects,
    shouldShuffle,
    isQuizMode,
    isLoading,
    addSubjectId,
    deleteSubjectId,
    clearSubjectIds,
    onStartReview,
  } =
    level.value !== undefined
      ? useReviewSelection(level.value)
      : {
          selectedSubjectIds: ref<Set<number>>(new Set<number>()),
          selectedSubjects: computed<ReviewSubject[]>(() => []),
          shouldShuffle: ref<boolean>(false),
          isQuizMode: ref<boolean>(false),
          isLoading: computed<boolean>(() => true),
          addSubjectId: () => {},
          deleteSubjectId: () => {},
          clearSubjectIds: () => {},
          onStartReview: () => {},
        };

  const canReview = computed<boolean>(() => selectedSubjects.value.length > 0);

  const handleLoadDeck = (deckId: string | null, subjectIds: number[]) => {
    clearSubjectIds();

    subjectIds.forEach((id) => addSubjectId(id));

    loadedDeckId.value = deckId;
  };

  const handleLoadLeeches = (subjectIds: number[]) => {
    handleLoadDeck(null, subjectIds);
  };

  const handleSaveDeck = (name: string) => {
    saveDeck(name, [...selectedSubjectIds.value]);
  };

  const handleAddSubjectId = (id: number) => {
    addSubjectId(id);

    loadedDeckId.value = null;
  };

  const handleDeleteSubjectId = (id: number) => {
    deleteSubjectId(id);

    loadedDeckId.value = null;
  };

  const handleClearSubjectIds = () => {
    clearSubjectIds();

    loadedDeckId.value = null;
  };

  const handleStartReview = () => {
    resetQuizReport();
    setSourceDeckId(loadedDeckId.value);
    onStartReview();
  };

  return {
    loadedDeckId,
    level,
    selectedSubjectIds,
    selectedSubjects,
    shouldShuffle,
    isQuizMode,
    isLoading,
    canReview,
    handleLoadDeck,
    handleLoadLeeches,
    handleSaveDeck,
    handleAddSubjectId,
    handleDeleteSubjectId,
    handleClearSubjectIds,
    handleStartReview,
  };
};
