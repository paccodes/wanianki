import { computed, type ComputedRef, ref, type Ref } from "vue";
import { useRouter } from "vue-router";

import type { ReviewSubject } from "../types";

import { subjectsById, useLearningMaterial } from "./use-learning-material";
import { useReviewNavigationPaths } from "./use-review-navigation-paths";
import { isQuizMode, shouldShuffle } from "./use-review-preferences";

interface ReturnValue {
  selectedSubjectIds: Ref<Set<number>>;
  selectedSubjects: ComputedRef<ReviewSubject[]>;
  isLoading: ComputedRef<boolean>;
  addSubjectId: (id: number) => void;
  deleteSubjectId: (id: number) => void;
  clearSubjectIds: () => void;
  onStartReview: () => void;
}

export const useReviewSelection = (userLevel: number): ReturnValue => {
  const router = useRouter();

  const selectedSubjectIds = ref<Set<number>>(new Set());

  const selectedSubjects = computed<ReviewSubject[]>(() =>
    [...selectedSubjectIds.value]
      .map((id) => subjectsById.value.get(id))
      .filter((subject): subject is ReviewSubject => subject !== undefined),
  );

  const isLoading = useLearningMaterial(userLevel);

  const addSubjectId = (id: number) => {
    selectedSubjectIds.value.add(id);
  };

  const deleteSubjectId = (id: number) => {
    selectedSubjectIds.value.delete(id);
  };

  const clearSubjectIds = () => {
    selectedSubjectIds.value.clear();
  };

  const { createReviewNavigationPaths, getNextReviewNavigationPath } =
    useReviewNavigationPaths();

  const onStartReview = () => {
    createReviewNavigationPaths({
      selectedSubjects,
      shouldShuffle,
      isQuizMode,
    });

    const navigationPath = getNextReviewNavigationPath();

    if (navigationPath) {
      router.push(navigationPath);
    }
  };

  return {
    selectedSubjectIds,
    selectedSubjects,
    isLoading,
    addSubjectId,
    deleteSubjectId,
    clearSubjectIds,
    onStartReview,
  };
};
