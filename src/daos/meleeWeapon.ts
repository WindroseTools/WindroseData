import meleeWeaponsData from "../../data/meleeWeapon.json";
import { Damages, StatDetails, Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { AttackLevels } from "../types/Level";
import { Rarity } from "../types/Rarity";
import { Ascension, MeleeWeaponType } from "../types/Weapon";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type MeleeWeaponKey = keyof typeof meleeWeaponsData;
type MeleeWeaponData<TRequired = number> = {
    type: MeleeWeaponType;
    rarity?: Rarity;
    stackLimit: number;
    station?: Station;
    damages: Damages;
    stats: StatDetails;
    levels: AttackLevels;
    effects?: Effect[];
    ascension?: Ascension;
    required?: Record<string, TRequired>;
};

type MeleeWeaponRawData = MeleeWeaponData<number>;
type MeleeWeaponResolvedData = MeleeWeaponData<RequirementEntry>;

type MeleeWeaponsByVersion = MultiVersion<MeleeWeaponKey, MeleeWeapon>;

export class MeleeWeapon {
    public id: string;
    public type: MeleeWeaponType;
    public dataType: "meleeWeapon";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public damages: Damages;
    public stats: StatDetails;
    public levels: AttackLevels;
    public effects?: Effect[];
    public ascension?: Ascension;
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: MeleeWeaponResolvedData) {
        this.id = id;
        this.type = data.type;
        this.dataType = "meleeWeapon";
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

    static loadMeleeWeaponsByVersion(): MeleeWeaponsByVersion {
        const rawByVersion = createVersionedRawStore(
            meleeWeaponsData as Record<MeleeWeaponKey, Partial<Record<Version, MeleeWeaponRawData>>>,
        );
        const meleeWeaponsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new MeleeWeapon(id, { ...baseData });
            },
        ) as MeleeWeaponsByVersion;

        RequirementUtils.registerLookupContext({
            getMeleeWeapon: (id, version) => meleeWeaponsByVersion[version][id as MeleeWeaponKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            meleeWeaponsByVersion,
            (data) => data.required,
            (meleeWeapon, required) => {
                meleeWeapon.required = required ?? {};
            },
            resolvers,
        );

        return meleeWeaponsByVersion;
    }
}

export const MeleeWeapons: MeleeWeaponsByVersion = MeleeWeapon.loadMeleeWeaponsByVersion();