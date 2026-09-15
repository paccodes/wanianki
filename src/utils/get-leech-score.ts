const MINIMUM_STREAK = 1;
const STREAK_EXPONENT = 1.5;

export const getLeechScore = (
  incorrectCount: number,
  currentStreak: number,
): number => {
  if (incorrectCount <= 0) {
    return 0;
  }

  return (
    incorrectCount / Math.max(currentStreak, MINIMUM_STREAK) ** STREAK_EXPONENT
  );
};
