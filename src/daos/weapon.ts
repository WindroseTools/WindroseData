import weaponsData from "../../data/weapon.json";
import { Damages, StatDetails, Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { AttackLevels } from "../types/Level";
import { Rarity } from "../types/Rarity";
import { WeaponType } from "../types/Weapon";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type WeaponKey = keyof typeof weaponsData;
type WeaponData<TRequired = number> = {
    type: WeaponType;
    rarity?: Rarity;
    stackLimit: number;
    station?: Station;
    damages: Damages;
    stats: StatDetails;
    levels: AttackLevels;
    effects?: Effect[];
    required: Record<string, TRequired>;
};

type WeaponRawData = WeaponData<number>;
type WeaponResolvedData = WeaponData<RequirementEntry>;

type WeaponsByVersion = MultiVersion<WeaponKey, Weapon>;

export class Weapon {
    public id: string;
    public type: WeaponType;
    public dataType: "weapon";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public damages: Damages;
    public stats: StatDetails;
    public levels: AttackLevels;
    public effects?: Effect[];
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: WeaponResolvedData) {
        this.id = id;
        this.type = data.type;
        this.dataType = "weapon";
        this.rarity = data.rarity ?? "common";
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.damages = data.damages;
        this.stats = data.stats;
        this.levels = data.levels;
        this.effects = data.effects;
        this.required = data.required;
    }

    static loadWeaponsByVersion(): WeaponsByVersion {
        const rawByVersion = createVersionedRawStore(
            weaponsData as Record<WeaponKey, Partial<Record<Version, WeaponRawData>>>,
        );
        const weaponsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Weapon(id, { ...baseData, required: {} });
            },
        ) as WeaponsByVersion;

        RequirementUtils.registerLookupContext({
            getWeapon: (id, version) => weaponsByVersion[version][id as WeaponKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            weaponsByVersion,
            (data) => data.required,
            (weapon, required) => {
                weapon.required = required ?? {};
            },
            resolvers,
        );

        return weaponsByVersion;
    }
}

export const Weapons: WeaponsByVersion = Weapon.loadWeaponsByVersion();