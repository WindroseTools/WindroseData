import ammoData from "../../data/ammo.json";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type AmmoKey = keyof typeof ammoData;
type AmmoData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required?: Record<string, TRequired>;
};

type AmmoRawData = AmmoData<number>;
type AmmoResolvedData = AmmoData<RequirementEntry>;
type AmmoByVersion = MultiVersion<AmmoKey, Ammo>;

export class Ammo {
    public id: string;
    public dataType: "ammo";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: AmmoResolvedData) {
        this.id = id;
        this.dataType = "ammo";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
    }

    static loadAmmoByVersion(): AmmoByVersion {
        const rawByVersion = createVersionedRawStore(
            ammoData as Record<AmmoKey, Partial<Record<Version, AmmoRawData>>>,
        );
        const ammoByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Ammo(id, baseData);
            },
        ) as AmmoByVersion;

        RequirementUtils.registerLookupContext({
            getAmmo: (id, version) => ammoByVersion[version][id as AmmoKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            ammoByVersion,
            (data) => data.required,
            (ammo, required) => {
                ammo.required = required;
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return ammoByVersion;
    }
}

export const Ammos: AmmoByVersion = Ammo.loadAmmoByVersion();