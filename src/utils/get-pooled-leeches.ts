import type { LeechItem, LeechSource } from "../types";

const NO_SCORE = 0;

interface Params {
  enabledSources: LeechSource[];
  statisticalScores: Map<number, number>;
  manualSubjectIds: number[];
  confusionGroups: number[][];
  curatedGroups: number[][];
  knownSubjects: Map<number, unknown>;
}

export const getPooledLeeches = ({
  enabledSources,
  statisticalScores,
  manualSubjectIds,
  confusionGroups,
  curatedGroups,
  knownSubjects,
}: Params): LeechItem[] => {
  const items = new Map<number, LeechItem>();

  const addLeech = (
    subjectId: number,
    source: LeechSource,
    score = NO_SCORE,
    groupId?: string,
  ) => {
    if (!knownSubjects.has(subjectId)) {
      return;
    }

    const item = items.get(subjectId);

    if (!item) {
      items.set(subjectId, { subjectId, sources: [source], score, groupId });

      return;
    }

    if (!item.sources.includes(source)) {
      item.sources.push(source);
    }

    item.score = Math.max(item.score, score);

    item.groupId ??= groupId;
  };

  const addLeechGroups = (groups: number[][], source: LeechSource) => {
    groups.forEach((subjectIds, index) => {
      subjectIds.forEach((subjectId) => {
        addLeech(subjectId, source, NO_SCORE, `${source}:${index}`);
      });
    });
  };

  if (enabledSources.includes("statistical")) {
    statisticalScores.forEach((score, subjectId) => {
      addLeech(subjectId, "statistical", score);
    });
  }

  if (enabledSources.includes("manual")) {
    manualSubjectIds.forEach((subjectId) => {
      addLeech(subjectId, "manual");
    });
  }

  if (enabledSources.includes("confusion")) {
    addLeechGroups(confusionGroups, "confusion");
  }

  if (enabledSources.includes("curated")) {
    addLeechGroups(curatedGroups, "curated");
  }

  return [...items.values()];
};
