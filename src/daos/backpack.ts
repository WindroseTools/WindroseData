import backpackData from "../../data/backpack.json";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type BackpackKey = keyof typeof backpackData;
type BackpackData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required: Record<string, TRequired>;
};

type BackpackRawData = BackpackData<number>;
type BackpackResolvedData = BackpackData<RequirementEntry>;
type BackpacksByVersion = MultiVersion<BackpackKey, Backpack>;

export class Backpack {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: BackpackResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
    }

    static loadBackpacksByVersion(): BackpacksByVersion {
        const rawByVersion = createVersionedRawStore(
            backpackData as Record<BackpackKey, Partial<Record<Version, BackpackRawData>>>,
        );
        const backpacksByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Backpack(id, { ...baseData, required: {} });
            },
        ) as BackpacksByVersion;

        RequirementUtils.registerLookupContext({
            getBackpack: (id, version) => backpacksByVersion[version][id as BackpackKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            backpacksByVersion,
            (data) => data.required,
            (backpack, required) => {
                backpack.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return backpacksByVersion;
    }
}

export const Backpacks: BackpacksByVersion = Backpack.loadBackpacksByVersion();