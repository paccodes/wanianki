import { describe, expect, it } from "vitest";
import { computed, ref } from "vue";

import type { ReviewSubject } from "../../types";

import { getNavigationPathsFromSelectedSubjects } from "../get-navigation-paths-from-selected-subjects";

const createMockSubject = (
  type: "kanji" | "radical" | "vocabulary",
  slug: string,
  id = 1,
): ReviewSubject =>
  ({
    id,
    object: type,
    data: { slug, level: 1 },
  }) as ReviewSubject;

describe("getNavigationPathsFromSelectedSubjects", () => {
  describe("study mode (isQuizMode = false)", () => {
    it("generates study paths for kanji", () => {
      const subjects = computed(() => [createMockSubject("kanji", "日")]);
      const isQuizMode = ref(false);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });

      expect(paths).toEqual(["study/kanji/日"]);
    });

    it("generates study paths for vocabulary", () => {
      const subjects = computed(() => [
        createMockSubject("vocabulary", "人口"),
      ]);
      const isQuizMode = ref(false);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });

      expect(paths).toEqual(["study/vocabulary/人口"]);
    });

    it("generates study paths for radicals", () => {
      const subjects = computed(() => [createMockSubject("radical", "ground")]);
      const isQuizMode = ref(false);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });

      expect(paths).toEqual(["study/radical/ground"]);
    });

    it("generates paths for multiple subjects", () => {
      const subjects = computed(() => [
        createMockSubject("kanji", "日"),
        createMockSubject("vocabulary", "人口"),
        createMockSubject("radical", "ground"),
      ]);
      const isQuizMode = ref(false);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });

      expect(paths).toEqual([
        "study/kanji/日",
        "study/vocabulary/人口",
        "study/radical/ground",
      ]);
    });
  });

  describe("quiz mode (isQuizMode = true)", () => {
    it("generates both meaning and reading quiz paths for kanji", () => {
      const subjects = computed(() => [createMockSubject("kanji", "日")]);
      const isQuizMode = ref(true);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });

      expect(paths).toEqual(["quiz/meaning/kanji/日", "quiz/reading/kanji/日"]);
    });

    it("generates both meaning and reading quiz paths for vocabulary", () => {
      const subjects = computed(() => [
        createMockSubject("vocabulary", "人口"),
      ]);
      const isQuizMode = ref(true);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });

      expect(paths).toEqual([
        "quiz/meaning/vocabulary/人口",
        "quiz/reading/vocabulary/人口",
      ]);
    });

    it("generates only meaning quiz path for radicals (base64 encoded slug)", () => {
      const subjects = computed(() => [createMockSubject("radical", "ground")]);
      const isQuizMode = ref(true);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });
      const expectedBase64Slug = btoa("ground");

      expect(paths).toEqual([`quiz/meaning/radical/${expectedBase64Slug}`]);
    });

    it("generates correct paths for mixed subject types", () => {
      const subjects = computed(() => [
        createMockSubject("kanji", "日"),
        createMockSubject("radical", "ground"),
        createMockSubject("vocabulary", "人口"),
      ]);
      const isQuizMode = ref(true);
      const paths = getNavigationPathsFromSelectedSubjects({
        selectedSubjects: subjects,
        isQuizMode,
      });
      const expectedRadicalSlug = btoa("ground");

      expect(paths).toEqual([
        "quiz/meaning/kanji/日",
        "quiz/reading/kanji/日",
        `quiz/meaning/radical/${expectedRadicalSlug}`,
        "quiz/meaning/vocabulary/人口",
        "quiz/reading/vocabulary/人口",
      ]);
    });
  });

  it("returns empty array for empty subjects", () => {
    const subjects = computed(() => [] as ReviewSubject[]);
    const isQuizMode = ref(false);
    const paths = getNavigationPathsFromSelectedSubjects({
      selectedSubjects: subjects,
      isQuizMode,
    });

    expect(paths).toEqual([]);
  });
});
