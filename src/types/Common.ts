export type Station = {
    id: string;
    level?: number;
};

export const StatAffinities = ["strength","agility","precision","mastery","vitality","endurance"] as const;
export type StatAffinity = (typeof StatAffinities)[number];
export const StatAffinityClasses = ["S","A","B","C","D","E"] as const;
export type StatAffinityClass = (typeof StatAffinityClasses)[number];

export const DamageTypes = ["crude","slash","pierce"] as const;
export type DamageType = (typeof DamageTypes)[number];
// @ts-ignore
export const StatAffinityDamageTypeMap: Record<StatAffinity, DamageType> = {
    "strength": "crude",
    "agility": "slash",
    "precision": "pierce"
}