import {
  computed,
  type ComputedRef,
  ref,
  type Ref,
  shallowRef,
  type WritableComputedRef,
} from "vue";

import { getReviewStatisticCollection } from "../api";
import { isCacheExpired } from "../cache";
import { curatedLeechLists } from "../data";
import {
  LEECH_FILTERS_KEY,
  MANUAL_LEECHES_KEY,
  REVIEW_STATISTICS_KEY,
} from "../storage-keys";
import type {
  CuratedLeechGroup,
  CuratedLeechList,
  CuratedLeechScope,
  Leech,
  LeechFilters,
  LeechItem,
  LeechSource,
  ReviewStatisticResponse,
} from "../types";
import {
  fetchAllPages,
  getAvailableSubjects,
  getConfusionLeechGroups,
  getCuratedLeechGroups,
  getDrillableSubjectIds,
  getErrorMessage,
  getLeechGroupIds,
  getPooledLeeches,
  getSortedLeeches,
  getStatisticalLeechScores,
  getSubjectIdsByCharacters,
  getToggledArray,
  resolveCuratedLeeches,
} from "../utils";

import {
  allSubjects,
  subjectCollection,
  subjectsById,
} from "./use-learning-material";
import { useLocalStorage } from "./use-local-storage";
import { apiToken, user } from "./use-login";
import { useNotifications } from "./use-notifications";
import { useOpfsStorage } from "./use-opfs-storage";

interface ReturnValue {
  leeches: ComputedRef<Leech[]>;
  countsBySource: ComputedRef<Record<LeechSource, number>>;
  countsByCuratedList: ComputedRef<Record<string, number>>;
  countsByCuratedScope: ComputedRef<Record<CuratedLeechScope, number>>;
  curatedLists: CuratedLeechList[];
  curatedScope: WritableComputedRef<CuratedLeechScope>;
  isLoading: Ref<boolean>;
  lastSyncedAt: Ref<number | null>;
  fetchReviewStatistics: (apiKey: string) => Promise<void>;
  isManualLeech: (subjectId: number) => boolean;
  toggleManualLeech: (subjectId: number) => void;
  isSourceEnabled: (source: LeechSource) => boolean;
  toggleSource: (source: LeechSource) => void;
  isCuratedListEnabled: (listId: string) => boolean;
  toggleCuratedList: (listId: string) => void;
}

export const LEECH_SOURCES: LeechSource[] = [
  "statistical",
  "manual",
  "confusion",
  "curated",
];

const lists = curatedLeechLists as CuratedLeechList[];

const DEFAULT_LEECH_FILTERS: LeechFilters = {
  sources: [...LEECH_SOURCES],
  curatedListIds: lists.map(({ id }) => id),
  curatedScope: "struggling",
};

const { addNotification } = useNotifications();

const { getValue, setValue } = useOpfsStorage<
  ReviewStatisticResponse,
  "collection"
>(REVIEW_STATISTICS_KEY);

const reviewStatistics = shallowRef<ReviewStatisticResponse[]>([]);
const lastSyncedAt = ref<number | null>(null);
const isLoading = ref<boolean>(false);

const manualLeechIds = useLocalStorage<number[]>(MANUAL_LEECHES_KEY, []);
const filters = useLocalStorage<LeechFilters>(
  LEECH_FILTERS_KEY,
  DEFAULT_LEECH_FILTERS,
);

const availableSubjectIds = computed<Set<number>>(
  () =>
    new Set(
      getAvailableSubjects(allSubjects.value, user.value?.level).map(
        ({ id }) => id,
      ),
    ),
);

const statisticalScores = computed<Map<number, number>>(() =>
  getStatisticalLeechScores(reviewStatistics.value),
);

const strugglingSubjectIds = computed<Set<number>>(
  () =>
    new Set<number>([
      ...statisticalScores.value.keys(),
      ...manualLeechIds.value,
    ]),
);

const drillableSubjectIds = computed<Set<number>>(() =>
  getDrillableSubjectIds({
    subjects: allSubjects.value,
    availableSubjectIds: availableSubjectIds.value,
    strugglingSubjectIds: strugglingSubjectIds.value,
  }),
);

const confusionLeechGroups = computed<number[][]>(() =>
  getConfusionLeechGroups({
    kanjiCollection: subjectCollection.kanji.value,
    drillableSubjectIds: drillableSubjectIds.value,
    strugglingSubjectIds: strugglingSubjectIds.value,
  }),
);

const subjectIdsByCharacters = computed<Map<string, number[]>>(() =>
  getSubjectIdsByCharacters(allSubjects.value),
);

const curatedGroups = computed<CuratedLeechGroup[]>(() =>
  resolveCuratedLeeches({
    lists,
    subjectIdsByCharacters: subjectIdsByCharacters.value,
    drillableSubjectIds: drillableSubjectIds.value,
  }),
);

const curatedScope = computed<CuratedLeechScope>({
  get: () => filters.value.curatedScope,
  set: (curatedScope) => {
    filters.value = { ...filters.value, curatedScope };
  },
});

const curatedLeechGroups = computed<number[][]>(() =>
  getCuratedLeechGroups({
    groups: curatedGroups.value,
    enabledListIds: filters.value.curatedListIds,
    scope: filters.value.curatedScope,
    strugglingSubjectIds: strugglingSubjectIds.value,
  }),
);

const getCuratedIds = (
  enabledListIds: string[],
  scope: CuratedLeechScope,
): number[] =>
  getLeechGroupIds(
    getCuratedLeechGroups({
      groups: curatedGroups.value,
      enabledListIds,
      scope,
      strugglingSubjectIds: strugglingSubjectIds.value,
    }),
  );

const countsByCuratedList = computed<Record<string, number>>(() =>
  Object.fromEntries(
    lists.map(({ id }) => [
      id,
      getCuratedIds([id], filters.value.curatedScope).length,
    ]),
  ),
);

const countsByCuratedScope = computed<Record<CuratedLeechScope, number>>(
  () => ({
    struggling: getCuratedIds(filters.value.curatedListIds, "struggling")
      .length,
    all: getCuratedIds(filters.value.curatedListIds, "all").length,
  }),
);

const getPool = (enabledSources: LeechSource[]): LeechItem[] =>
  getPooledLeeches({
    enabledSources,
    statisticalScores: statisticalScores.value,
    manualSubjectIds: manualLeechIds.value,
    confusionGroups: confusionLeechGroups.value,
    curatedGroups: curatedLeechGroups.value,
    knownSubjects: subjectsById.value,
  });

const countsBySource = computed<Record<LeechSource, number>>(() => ({
  statistical: getPool(["statistical"]).length,
  manual: getPool(["manual"]).length,
  confusion: getPool(["confusion"]).length,
  curated: getPool(["curated"]).length,
}));

const leeches = computed<Leech[]>(() =>
  getSortedLeeches(getPool(filters.value.sources)).flatMap((leech) => {
    const subject = subjectsById.value.get(leech.subjectId);

    return subject ? [{ ...leech, subject }] : [];
  }),
);

const manualLeechIdSet = computed<Set<number>>(
  () => new Set(manualLeechIds.value),
);

const isManualLeech = (subjectId: number): boolean =>
  manualLeechIdSet.value.has(subjectId);

const toggleManualLeech = (subjectId: number): void => {
  manualLeechIds.value = getToggledArray(manualLeechIds.value, subjectId);
};

const isCuratedListEnabled = (listId: string): boolean =>
  filters.value.curatedListIds.includes(listId);

const toggleCuratedList = (listId: string): void => {
  filters.value = {
    ...filters.value,
    curatedListIds: getToggledArray(filters.value.curatedListIds, listId),
  };
};

const isSourceEnabled = (source: LeechSource): boolean =>
  filters.value.sources.includes(source);

const toggleSource = (source: LeechSource): void => {
  filters.value = {
    ...filters.value,
    sources: getToggledArray(filters.value.sources, source),
  };
};

const loadCachedReviewStatistics = async (): Promise<void> => {
  try {
    const cachedData = await getValue();

    if (!cachedData) {
      return;
    }

    if (isCacheExpired(cachedData)) {
      await setValue(null);

      return;
    }

    reviewStatistics.value = cachedData.data;
    lastSyncedAt.value = cachedData.cachedAt;
  } catch (error) {
    addNotification(
      getErrorMessage(error, "Failed to load cached leech data"),
      "error",
    );
  }
};

const fetchReviewStatistics = async (apiKey: string): Promise<void> => {
  isLoading.value = true;
  apiToken.value = apiKey;

  try {
    const statistics = await fetchAllPages<
      ReviewStatisticResponse,
      "collection"
    >(getReviewStatisticCollection());

    reviewStatistics.value = statistics;
    lastSyncedAt.value = Date.now();

    await setValue(statistics);

    addNotification("Leech data successfully synced", "success");
  } catch (error) {
    addNotification(
      getErrorMessage(error, "Failed to sync leech data"),
      "error",
    );
  } finally {
    apiToken.value = null;
    isLoading.value = false;
  }
};

let isInitialized = false;

export const useLeeches = (): ReturnValue => {
  if (!isInitialized) {
    isInitialized = true;

    loadCachedReviewStatistics();
  }

  return {
    leeches,
    countsBySource,
    countsByCuratedList,
    countsByCuratedScope,
    curatedLists: lists,
    curatedScope,
    isLoading,
    lastSyncedAt,
    fetchReviewStatistics,
    isManualLeech,
    toggleManualLeech,
    isSourceEnabled,
    toggleSource,
    isCuratedListEnabled,
    toggleCuratedList,
  };
};
