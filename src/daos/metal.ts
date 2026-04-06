import metalsData from "../../data/metal.json";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type MetalKey = keyof typeof metalsData;
type MetalData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required?: Record<string, TRequired>;
};

type MetalRawData = MetalData<number>;
type MetalResolvedData = MetalData<RequirementEntry>;
type MetalsByVersion = MultiVersion<MetalKey, Metal>;

export class Metal {
    public id: string;
    public dataType: "metal";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: MetalResolvedData) {
        this.id = id;
        this.dataType = "metal";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
    }

    static loadMetalsByVersion(): MetalsByVersion {
        const rawByVersion = createVersionedRawStore(
            metalsData as Record<MetalKey, Partial<Record<Version, MetalRawData>>>,
        );
        const metalsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Metal(id, { ...baseData, required: {} });
            },
        ) as MetalsByVersion;

        RequirementUtils.registerLookupContext({
            getMetal: (id, version) => metalsByVersion[version][id as MetalKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            metalsByVersion,
            (data) => data.required,
            (metal, required) => {
                metal.required = required ?? {};
            },
            resolvers,
        );

        return metalsByVersion;
    }
}

export const Metals: MetalsByVersion = Metal.loadMetalsByVersion();