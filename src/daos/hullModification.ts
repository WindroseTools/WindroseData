import hullModificationData from "../../data/hullModification.json";
import { ArmorLevels } from "../types/Armor";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type HullModificationKey = keyof typeof hullModificationData;
type HullModificationData<TRequired = number> = {
    rarity: Rarity;
    station?: Station;
    levels: ArmorLevels;
    required: Record<string, TRequired>;
};

type HullModificationRawData = HullModificationData<number>;
type HullModificationResolvedData = HullModificationData<RequirementEntry>;
type HullModificationsByVersion = MultiVersion<HullModificationKey, HullModification>;

export class HullModification {
    public id: string;
    public dataType: "hullModification";
    public rarity: Rarity;
    public station?: Station;
    public levels: ArmorLevels;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: HullModificationResolvedData) {
        this.id = id;
        this.dataType = "hullModification";
        this.rarity = data.rarity;
        this.station = data.station;
        this.levels = data.levels;
        this.required = data.required;
    }

    static loadHullModificationsByVersion(): HullModificationsByVersion {
        const rawByVersion = createVersionedRawStore(
            hullModificationData as Record<HullModificationKey, Partial<Record<Version, HullModificationRawData>>>,
        );
        const hullModificationsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new HullModification(id, { ...baseData, required: {} });
            },
        ) as HullModificationsByVersion;

        RequirementUtils.registerLookupContext({
            getHullModification: (id, version) => hullModificationsByVersion[version][id as HullModificationKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            hullModificationsByVersion,
            (data) => data.required,
            (hullModification, required) => {
                hullModification.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return hullModificationsByVersion;
    }
}

export const HullModifications: HullModificationsByVersion = HullModification.loadHullModificationsByVersion();