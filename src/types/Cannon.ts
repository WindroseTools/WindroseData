import { Station } from "./Common";

export type CannonLevels = Record<string, CannonLevel>;
export type CannonLevel = {
    "attackScore": number;
    "station"?: Station;
    "required"?: Record<string, number>;
}

export const RangeGrades = ["S","A","B","C","D","E"] as const;
export type RangeGrade = (typeof RangeGrades)[number];

export const AccuracyGrades = ["S","A","B","C","D","E"] as const;
export type AccuracyGrade = (typeof AccuracyGrades)[number];