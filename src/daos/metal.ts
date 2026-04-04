import metalsData from "../../data/metal.json";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries } from "./helpers";
import { RequirementUtils } from "./requirements";

type MetalKey = keyof typeof metalsData;
type MetalData = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station
};

type MetalsByVersion = MultiVersion<MetalKey, Metal>;

export class Metal {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;

    constructor(id: string, data: MetalData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
    }

    static loadMetalsByVersion(): MetalsByVersion {
        const rawByVersion = createVersionedRawStore(
            metalsData as Record<MetalKey, Partial<Record<Version, MetalData>>>,
        );
        const metalsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => new Metal(id, { ...data }),
        ) as MetalsByVersion;

        RequirementUtils.registerLookupContext({
            getMetal: (id, version) => metalsByVersion[version][id as MetalKey],
        });

        return metalsByVersion;
    }
}

export const Metals: MetalsByVersion = Metal.loadMetalsByVersion();