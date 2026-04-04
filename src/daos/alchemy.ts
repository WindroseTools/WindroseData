import alchemyData from "../../data/alchemy.json";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type AlchemyKey = keyof typeof alchemyData;
type AlchemyData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required?: Record<string, TRequired>;
};

type AlchemyRawData = AlchemyData<number>;
type AlchemyResolvedData = AlchemyData<RequirementEntry>;
type AlchemyByVersion = MultiVersion<AlchemyKey, Alchemy>;

export class Alchemy {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: AlchemyResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
    }

    static loadAlchemyByVersion(): AlchemyByVersion {
        const rawByVersion = createVersionedRawStore(
            alchemyData as Record<AlchemyKey, Partial<Record<Version, AlchemyRawData>>>,
        );
        const alchemyByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Alchemy(id, baseData);
            },
        ) as AlchemyByVersion;

        RequirementUtils.registerLookupContext({
            getAlchemy: (id, version) => alchemyByVersion[version][id as AlchemyKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            alchemyByVersion,
            (data) => data.required,
            (alchemy, required) => {
                alchemy.required = required;
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return alchemyByVersion;
    }
}

export const Alchemies: AlchemyByVersion = Alchemy.loadAlchemyByVersion();