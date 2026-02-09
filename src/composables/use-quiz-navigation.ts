import {
  computed,
  type ComputedRef,
  onBeforeUnmount,
  onMounted,
  ref,
  type Ref,
  useTemplateRef,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { isHiragana, toHiragana, toRomaji } from "wanakana";

import { subjectCollection } from "../composables";
import type {
  QuizReport,
  QuizType,
  ReviewSubject,
  Subject,
  SubjectType,
} from "../types";
import {
  getAcceptedProperties,
  getDiceCoefficient,
  getSlugFromSubjectType,
  getSubjectFromSlug,
  isQuizType,
  isSubjectType,
} from "../utils";

import { useQuizReport } from "./use-quiz-report";
import { useReviewNavigationPaths } from "./use-review-navigation-paths";

type ValidationResult = "" | "correct" | "incorrect" | "invalid";

const MINIMUM_ACCEPTABLE_DICE_COEFFICIENT = 0.8;

interface ReturnValue {
  inputValue: Ref<string>;
  validationResult: Ref<ValidationResult>;
  acceptedAnswers: ComputedRef<string[]>;
  subject: ComputedRef<Subject | null>;
  subjectType: Ref<SubjectType>;
  quizType: Ref<QuizType>;
  quizReport: Ref<QuizReport>;
  onInput: (event: Event) => void;
  onNavigate: () => void;
}

export const useQuizNavigation = (): ReturnValue => {
  const route = useRoute();
  const router = useRouter();

  const inputRef = useTemplateRef<HTMLInputElement>("user-input");

  const { getNextReviewNavigationPath } = useReviewNavigationPaths();
  const { quizReport, updateQuizReport } = useQuizReport();

  const initialSubjectType = isSubjectType(route.params.subjectType)
    ? route.params.subjectType
    : null;
  const initialQuizType = isQuizType(route.params.quizType)
    ? route.params.quizType
    : null;
  const initialSlug = getSlugFromSubjectType(initialSubjectType, route.params);
  const initialReviewSubject =
    initialSlug && initialSubjectType
      ? getSubjectFromSlug(
          initialSlug,
          subjectCollection[initialSubjectType].value as ReviewSubject[],
        )
      : null;

  const subjectType = ref<SubjectType>(initialSubjectType ?? "kanji");
  const quizType = ref<QuizType>(initialQuizType ?? "meaning");
  const reviewSubject = ref<ReviewSubject | null>(initialReviewSubject);

  const inputValue = ref<string>("");
  const validationResult = ref<ValidationResult>("");

  const subject = computed<Subject | null>(
    () => reviewSubject.value?.data ?? null,
  );
  const acceptedAnswers = computed<string[]>(() =>
    getAcceptedProperties(subject.value, quizType.value),
  );

  watch(
    () => route.params,
    (params) => {
      const newSubjectType = isSubjectType(params.subjectType)
        ? params.subjectType
        : null;
      const newQuizType = isQuizType(params.quizType) ? params.quizType : null;
      const newSlug = getSlugFromSubjectType(newSubjectType, params);

      if (!newSubjectType || !newQuizType || !newSlug) {
        router.push("/");
      } else {
        const newReviewSubject = getSubjectFromSlug(
          newSlug,
          subjectCollection[newSubjectType].value as ReviewSubject[],
        );

        subjectType.value = newSubjectType;
        quizType.value = newQuizType;
        reviewSubject.value = newReviewSubject;

        inputRef.value?.focus();
      }
    },
  );

  const validate = () => {
    let _validationResult: ValidationResult = "incorrect";

    if (inputValue.value.length === 0) {
      _validationResult = "invalid";
    } else if (quizType.value === "reading" && !isHiragana(inputValue.value)) {
      _validationResult = "invalid";
    } else if (
      quizType.value === "reading" &&
      acceptedAnswers.value.includes(inputValue.value.trim())
    ) {
      _validationResult = "correct";
    } else if (
      quizType.value === "meaning" &&
      acceptedAnswers.value.some(
        (acceptedAnswer) =>
          getDiceCoefficient(acceptedAnswer, inputValue.value) >=
          MINIMUM_ACCEPTABLE_DICE_COEFFICIENT,
      )
    ) {
      _validationResult = "correct";
    }

    validationResult.value = _validationResult;

    if (_validationResult === "correct" || _validationResult === "incorrect") {
      updateQuizReport({
        subjectType: subjectType.value,
        quizType: quizType.value,
        subject: reviewSubject.value,
        status: _validationResult,
      });
    }
  };

  const onNavigate = () => {
    if (validationResult.value === "" || validationResult.value === "invalid") {
      validate();
    } else {
      validationResult.value = "";
      inputValue.value = "";

      const navigationPath = getNextReviewNavigationPath();

      if (navigationPath) {
        router.push(`/${navigationPath}`);
      } else {
        router.push("/quiz-summary");
      }
    }
  };

  const onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;

    validationResult.value = "";

    if (quizType.value === "meaning") {
      inputValue.value = value;
    } else {
      inputValue.value = toHiragana(toRomaji(value), { IMEMode: true });
    }
  };

  const onKeyDownEventListener = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Enter": {
        onNavigate();

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

  return {
    inputValue,
    validationResult,
    acceptedAnswers,
    subject,
    subjectType,
    quizType,
    quizReport,
    onInput,
    onNavigate,
  };
};
