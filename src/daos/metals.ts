import metalsData from "../../data/metals.json";
import { Rarity } from "../types/Rarity";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";

type MetalKey = keyof typeof metalsData;
type MetalData = {
    rarity: Rarity;
    stackLimit: number;
};

type MetalsByVersion = MultiVersion<MetalKey, Metal>;

export class Metal {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;

    constructor(id: string, data: MetalData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
    }

    static loadMetalsByVersion(): MetalsByVersion {
        return loadVersionedData(
            metalsData as Record<MetalKey, Partial<Record<VersionKey, MetalData>>>,
            (id, data) => new Metal(id, { ...data }),
        ) as MetalsByVersion;
    }
}

export const Metals: MetalsByVersion = Metal.loadMetalsByVersion();