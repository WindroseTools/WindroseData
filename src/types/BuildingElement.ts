import { BuildingElement } from "../daos/buildingElement";

export const BETypes = [
    "essential","crafting","cooking","personalEquipment","shipEquipment","alchemy","jewelery","refining","bed","storage","label","foundation","floor","wall","roof",
    "pillar","beam","corner","window","door","stair","fence","handrail","trophy","seating","table","shelf","wardrobe","canopy","lamp","torch","dish","supply",
    "shellDecoration","candle",
    "pierDecoration","decoration","prebuiltStructure","other"
] as const;
export type BEType = (typeof BETypes)[number];

export const WorkingRestrictions = ["none", "roofRequired", "placementOutside"] as const;
export type WorkingRestriction = (typeof WorkingRestrictions)[number];

export const MountingRestrictions = ["none", "wallOnly", "ceilingOnly"] as const;
export type MountingRestriction = (typeof MountingRestrictions)[number];

export type BuildingLevels = Record<string, BuildingLevel>;
export type BuildingLevel = {
    "requiresBonfire"?: boolean;
    "requiredAddons"?: BuildingElement["id"][];
}