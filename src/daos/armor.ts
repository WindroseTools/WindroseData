import armorsData from "../../data/armor.json";
import { ArmorLevels } from "../types/Armor";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type ArmorKey = keyof typeof armorsData;
type ArmorData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    set?: string;
    levels: ArmorLevels;
    required: Record<string, TRequired>;
};

type ArmorRawData = ArmorData<number>;
type ArmorResolvedData = ArmorData<RequirementEntry>;

type ArmorsByVersion = MultiVersion<ArmorKey, Armor>;

export class Armor {
    public id: string;
    public dataType: "armor";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public set?: string;
    public levels: ArmorLevels;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: ArmorResolvedData) {
        this.id = id;
        this.dataType = "armor";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.set = data.set;
        this.levels = data.levels;
        this.required = data.required;
    }

    static loadArmorsByVersion(): ArmorsByVersion {
        const rawByVersion = createVersionedRawStore(
            armorsData as Record<ArmorKey, Partial<Record<Version, ArmorRawData>>>,
        );
        const armorsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Armor(id, { ...baseData, required: {} });
            },
        ) as ArmorsByVersion;

        RequirementUtils.registerLookupContext({
            getArmor: (id, version) => armorsByVersion[version][id as ArmorKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            armorsByVersion,
            (data) => data.required,
            (armor, required) => {
                armor.required = required ?? {};
            },
            resolvers,
        );

        return armorsByVersion;
    }
}

export const Armors: ArmorsByVersion = Armor.loadArmorsByVersion();