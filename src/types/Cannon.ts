export const RangeGrades = ["S","A","B","C","D","E"] as const;
export type RangeGrade = (typeof RangeGrades)[number];

export const AccuracyGrades = ["S","A","B","C","D","E"] as const;
export type AccuracyGrade = (typeof AccuracyGrades)[number];