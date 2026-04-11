export const ArmorTypes = ["headwear","torso","gloves","pants","footwear"] as const;
export type ArmorType = (typeof ArmorTypes)[number];