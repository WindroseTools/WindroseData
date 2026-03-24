import cannonData from "../../data/cannon.json";
import { Rarity } from "../types/Rarity";
import { MultiVersion, VersionKey } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type CannonKey = keyof typeof cannonData;
type CannonData<TRequired = number> = {
    rarity: Rarity;
    required: Record<string, TRequired>;
};

type CannonRawData = CannonData<number>;
type CannonResolvedData = CannonData<RequirementEntry>;
type CannonsByVersion = MultiVersion<CannonKey, Cannon>;

export class Cannon {
    public id: string;
    public rarity: Rarity;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: CannonResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.required = data.required;
    }

    static loadCannonsByVersion(): CannonsByVersion {
        const rawByVersion = createVersionedRawStore(
            cannonData as Record<CannonKey, Partial<Record<VersionKey, CannonRawData>>>,
        );
        const cannonsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Cannon(id, { ...baseData, required: {} });
            },
        ) as CannonsByVersion;

        RequirementUtils.registerLookupContext({
            getCannon: (id, version) => cannonsByVersion[version][id as CannonKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            cannonsByVersion,
            (data) => data.required,
            (cannon, required) => {
                cannon.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return cannonsByVersion;
    }
}

export const Cannons: CannonsByVersion = Cannon.loadCannonsByVersion();