export const BETypes = [
    "essential","crafting","cooking","personalEquipment","shipEquipment","alchemy","refining","bed","storage","label","foundation","floor","wall","roof",
    "pillar","beam","corner","window","door","stair","fence","trophy","seating","table","shelf","wardrobe","canopy","lamp","torch","dish","supply","shellDecoration",
    "pierDecoration","decoration","other"
] as const;

export type BEType = (typeof BETypes)[number];