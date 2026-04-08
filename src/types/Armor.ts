export type ArmorLevels = Record<string, ArmorLevel>;
export type ArmorLevel = {
    "defenseScore": number;
    "required"?: Record<string, number>;
}