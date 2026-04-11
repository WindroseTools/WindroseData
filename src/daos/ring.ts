import ringsData from "../../data/ring.json";
import { Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type RingKey = keyof typeof ringsData;
type RingData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    effects: Effect[];
    required?: Record<string, TRequired>;
};

type RingRawData = RingData<number>;
type RingResolvedData = RingData<RequirementEntry>;

type RingsByVersion = MultiVersion<RingKey, Ring>;

export class Ring {
    public id: string;
    public dataType: "ring";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public effects: Effect[];
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: RingResolvedData) {
        this.id = id;
        this.dataType = "ring";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.effects = data.effects;
        this.required = data.required;
    }

    static loadRingsByVersion(): RingsByVersion {
        const rawByVersion = createVersionedRawStore(
            ringsData as Record<RingKey, Partial<Record<Version, RingRawData>>>,
        );
        const ringsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Ring(id, { ...baseData });
            },
        ) as RingsByVersion;

        RequirementUtils.registerLookupContext({
            getRing: (id, version) => ringsByVersion[version][id as RingKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            ringsByVersion,
            (data) => data.required,
            (ring, required) => {
                ring.required = required ?? {};
            },
            resolvers,
        );

        return ringsByVersion;
    }
}

export const Rings: RingsByVersion = Ring.loadRingsByVersion();