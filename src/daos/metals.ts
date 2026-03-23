import metalsData from "../../data/metals.json";
import { Rarity } from "../types/Rarity";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";

type MetalKey = keyof typeof metalsData;
type MetalData = {
    id: string;
    rarity: Rarity;
    stackLimit: number;
};

type MetalsByVersion = MultiVersion<MetalKey, Metal>;

export class Metal {
    constructor (
        public id: string,
        public rarity: Rarity,
        public stackLimit: number,
    ) {}

    static loadMetalsByVersion(): MetalsByVersion {
        return loadVersionedData(
            metalsData as Record<MetalKey, Partial<Record<VersionKey, MetalData>>>,
            (id, data) => new Metal(id, data.rarity as Rarity, data.stackLimit),
        ) as MetalsByVersion;
    }
}

export const Metals: MetalsByVersion = Metal.loadMetalsByVersion();