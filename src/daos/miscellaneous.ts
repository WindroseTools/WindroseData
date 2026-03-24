import miscellaneousData from "../../data/miscellaneous.json";
import { Rarity } from "../types/Rarity";
import { MultiVersion, VersionKey } from "../versions";
import "./resource";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type MiscellaneousKey = keyof typeof miscellaneousData;
type MiscellaneousData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    required?: Record<string, TRequired>;
};

type MiscellaneousRawData = MiscellaneousData<number>;
type MiscellaneousResolvedData = MiscellaneousData<RequirementEntry>;
type MiscellaneousItemsByVersion = MultiVersion<MiscellaneousKey, Miscellanies>;

export class Miscellanies {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: MiscellaneousResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.required = data.required;
    }

    static loadMiscellaneousItemsByVersion(): MiscellaneousItemsByVersion {
        const rawByVersion = createVersionedRawStore(
            miscellaneousData as Record<MiscellaneousKey, Partial<Record<VersionKey, MiscellaneousRawData>>>,
        );
        const miscellaneousItemsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Miscellanies(id, baseData);
            },
        ) as MiscellaneousItemsByVersion;

        RequirementUtils.registerLookupContext({
            getMiscellaneous: (id, version) => miscellaneousItemsByVersion[version][id as MiscellaneousKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            miscellaneousItemsByVersion,
            (data) => data.required,
            (miscellaneousItem, required) => {
                miscellaneousItem.required = required;
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return miscellaneousItemsByVersion;
    }
}

export const Miscellaneous: MiscellaneousItemsByVersion = Miscellanies.loadMiscellaneousItemsByVersion();