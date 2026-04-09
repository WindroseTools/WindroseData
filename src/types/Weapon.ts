export const WeaponTypes = ["melee","ranged"] as const;
export type WeaponType = (typeof WeaponTypes)[number];