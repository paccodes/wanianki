import type { LeechItem } from "../types";

const MANUAL_RANK = 0;
const SCORED_RANK = 1;
const UNSCORED_RANK = 2;

const getRank = ({ sources, score }: LeechItem): number => {
  if (sources.includes("manual")) {
    return MANUAL_RANK;
  }

  return score > 0 ? SCORED_RANK : UNSCORED_RANK;
};

const compareLeeches = (a: LeechItem, b: LeechItem): number =>
  getRank(a) - getRank(b) || b.score - a.score || a.subjectId - b.subjectId;

type LeechUnit = [LeechItem, ...LeechItem[]];

const getUnits = (leeches: LeechItem[]): LeechUnit[] => {
  const units: LeechUnit[] = [];
  const unitsByGroupId = new Map<string, LeechUnit>();

  for (const leech of leeches) {
    if (leech.groupId === undefined) {
      units.push([leech]);

      continue;
    }

    const unit = unitsByGroupId.get(leech.groupId);

    if (unit) {
      unit.push(leech);

      continue;
    }

    const newUnit: LeechUnit = [leech];

    unitsByGroupId.set(leech.groupId, newUnit);
    units.push(newUnit);
  }

  return units;
};

export const getSortedLeeches = (leeches: LeechItem[]): LeechItem[] => {
  const units = getUnits(leeches);

  for (const unit of units) {
    unit.sort(compareLeeches);
  }

  return units.sort(([a], [b]) => compareLeeches(a, b)).flat();
};
