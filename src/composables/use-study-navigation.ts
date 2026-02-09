import {
  onBeforeUnmount,
  onMounted,
  ref,
  type Ref,
  type ShallowRef,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";

import type { Subject, SubjectResponseWithSrsStage } from "../types";
import { getSubjectFromSlug, parseSlug } from "../utils";

import { useReviewNavigationPaths } from "./use-review-navigation-paths";

interface ReturnValue<T> {
  subject: Ref<T | null>;
  onNavigate: (direction: "previous" | "next") => () => void;
}

export const useStudyNavigation = <T extends Subject>(
  subjectCollection: ShallowRef<SubjectResponseWithSrsStage<T>[]>,
): ReturnValue<T> => {
  const route = useRoute();
  const router = useRouter();

  const initialSlug = parseSlug(route.params.slug);

  const subject = ref<T | null>(
    initialSlug
      ? (getSubjectFromSlug<T>(initialSlug, subjectCollection.value)?.data as T)
      : null,
  );

  watch(
    () => route.params.slug,
    (slug) => {
      const newSlug = parseSlug(slug);

      if (!newSlug) {
        router.push("/");
      } else {
        subject.value = getSubjectFromSlug<T>(newSlug, subjectCollection.value)
          ?.data as T;
      }
    },
  );

  const { getPreviousReviewNavigationPath, getNextReviewNavigationPath } =
    useReviewNavigationPaths();

  const onNavigate = (direction: "previous" | "next") => () => {
    const navigationPath =
      direction === "next"
        ? getNextReviewNavigationPath()
        : getPreviousReviewNavigationPath();

    if (navigationPath) {
      router.push(`/${navigationPath}`);
    } else {
      router.push("/");
    }
  };

  const onKeyDownEventListener = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Space":
      case "Enter": {
        const direction = event.ctrlKey ? "previous" : "next";

        onNavigate(direction)();

        break;
      }

      case "Escape": {
        router.push("/");

        break;
      }
      default: {
        return;
      }
    }
  };

  onMounted(() => {
    if (!subject.value) {
      router.push("/");
    }

    window.addEventListener("keydown", onKeyDownEventListener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeyDownEventListener);
  });

  return { subject: subject as Ref<T | null>, onNavigate };
};
