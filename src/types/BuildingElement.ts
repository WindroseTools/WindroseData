export const BETypes = [
    "essential","crafting","cooking","personalEquipment","shipEquipment","alchemy","refining","bed","storage","label","foundation","floor","wall","roof",
    "pillar","beam","corner","window","door","stair","fence","trophy","seating","table","shelf","wardrobe","canopy","lamp","torch","dish","supply","shellDecoration",
    "pierDecoration","decoration","other"
] as const;
export type BEType = (typeof BETypes)[number];

export const WorkingRestrictions = ["none", "roofRequired", "placementOutside"] as const;
export type WorkingRestriction = (typeof WorkingRestrictions)[number];

export const MountingRestrictions = ["none", "wallOnly", "ceilingOnly"] as const;
export type MountingRestriction = (typeof MountingRestrictions)[number];