export const WeaponTypes = ["melee","ranged"] as const;
export type WeaponType = (typeof WeaponTypes)[number];

export type Ascension<TRequired = number> = {
    id: string;
    required: Record<string, TRequired>;
}