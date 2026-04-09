import necklacesData from "../../data/necklace.json";
import { Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type NecklaceKey = keyof typeof necklacesData;
type NecklaceData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    effects: Effect[];
    required: Record<string, TRequired>;
};

type NecklaceRawData = NecklaceData<number>;
type NecklaceResolvedData = NecklaceData<RequirementEntry>;

type NecklacesByVersion = MultiVersion<NecklaceKey, Necklace>;

export class Necklace {
    public id: string;
    public dataType: "necklace";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public effects: Effect[];
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: NecklaceResolvedData) {
        this.id = id;
        this.dataType = "necklace";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.effects = data.effects;
        this.required = data.required;
    }

    static loadNecklacesByVersion(): NecklacesByVersion {
        const rawByVersion = createVersionedRawStore(
            necklacesData as Record<NecklaceKey, Partial<Record<Version, NecklaceRawData>>>,
        );
        const necklacesByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Necklace(id, { ...baseData, required: {} });
            },
        ) as NecklacesByVersion;

        RequirementUtils.registerLookupContext({
            getNecklace: (id, version) => necklacesByVersion[version][id as NecklaceKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            necklacesByVersion,
            (data) => data.required,
            (necklace, required) => {
                necklace.required = required ?? {};
            },
            resolvers,
        );

        return necklacesByVersion;
    }
}

export const Necklaces: NecklacesByVersion = Necklace.loadNecklacesByVersion();