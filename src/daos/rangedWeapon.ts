import rangedWeaponsData from "../../data/rangedWeapon.json";
import { Damages, StatDetails, Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { AttackLevels } from "../types/Level";
import { Rarity } from "../types/Rarity";
import { Ascension, RangedWeaponType } from "../types/Weapon";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type RangedWeaponKey = keyof typeof rangedWeaponsData;
type RangedWeaponData<TRequired = number> = {
    type: RangedWeaponType;
    rarity?: Rarity;
    stackLimit: number;
    station?: Station;
    damages: Damages;
    stats: StatDetails;
    levels: AttackLevels;
    effects?: Effect[];
    ascension?: Ascension;
    required: Record<string, TRequired>;
};

type RangedWeaponRawData = RangedWeaponData<number>;
type RangedWeaponResolvedData = RangedWeaponData<RequirementEntry>;

type RangedWeaponsByVersion = MultiVersion<RangedWeaponKey, RangedWeapon>;

export class RangedWeapon {
    public id: string;
    public type: RangedWeaponType;
    public dataType: "rangedWeapon";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public damages: Damages;
    public stats: StatDetails;
    public levels: AttackLevels;
    public effects?: Effect[];
    public ascension?: Ascension;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: RangedWeaponResolvedData) {
        this.id = id;
        this.type = data.type;
        this.dataType = "rangedWeapon";
        this.rarity = data.rarity ?? "common";
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.damages = data.damages;
        this.stats = data.stats;
        this.levels = data.levels;
        this.effects = data.effects;
        this.ascension = data.ascension;
        this.required = data.required;
    }

    static loadRangedWeaponsByVersion(): RangedWeaponsByVersion {
        const rawByVersion = createVersionedRawStore(
            rangedWeaponsData as Record<RangedWeaponKey, Partial<Record<Version, RangedWeaponRawData>>>,
        );
        const rangedWeaponsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new RangedWeapon(id, { ...baseData, required: {} });
            },
        ) as RangedWeaponsByVersion;

        RequirementUtils.registerLookupContext({
            getRangedWeapon: (id, version) => rangedWeaponsByVersion[version][id as RangedWeaponKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            rangedWeaponsByVersion,
            (data) => data.required,
            (rangedWeapon, required) => {
                rangedWeapon.required = required ?? {};
            },
            resolvers,
        );

        return rangedWeaponsByVersion;
    }
}

export const RangedWeapons: RangedWeaponsByVersion = RangedWeapon.loadRangedWeaponsByVersion();