export const RangedWeaponTypes = ["pistol","musket"] as const;
export type RangedWeaponType = (typeof RangedWeaponTypes)[number];

export const MeleeWeaponTypes = ["rapier","saber","halberd","club"] as const;
export type MeleeWeaponType = (typeof MeleeWeaponTypes)[number];

export type Ascension<TRequired = number> = {
    id: string;
    required: Record<string, TRequired>;
}