import { Alchemies, Alchemy } from "./daos/alchemy";
import { Ammos, Ammo } from "./daos/ammo";
import { Armor, Armors } from "./daos/armor";
import { Backpacks, Backpack } from "./daos/backpack";
import { BuildingElement, BuildingElements } from "./daos/buildingElement";
import { Cannon, Cannons } from "./daos/cannon";
import { CrewEquipment, CrewEquipments } from "./daos/crewEquipment";
import { Food, Foods } from "./daos/food";
import { HullModification, HullModifications } from "./daos/hullModification";
import { Item, Items } from "./daos/item";
import { Medicine, Medicines } from "./daos/medicine";
import { MeleeWeapon, MeleeWeapons } from "./daos/meleeWeapon";
import { Metal, Metals } from "./daos/metal";
import { Miscellanies, Miscellaneous } from "./daos/miscellaneous";
import { Necklace, Necklaces } from "./daos/necklace";
import { RangedWeapon, RangedWeapons } from "./daos/rangedWeapon";
import { Resource, Resources } from "./daos/resource";
import { Ring, Rings } from "./daos/ring";
import { Set, Sets } from "./daos/set";
import { Tool, Tools } from "./daos/tool";
import { Version, Versions } from "./versions";

type AllDaoTypes =
    | Alchemy
    | Ammo
    | Armor
    | Backpack
    | BuildingElement
    | Cannon
    | CrewEquipment
    | Food
    | HullModification
    | Item
    | Medicine
    | MeleeWeapon
    | Metal
    | Miscellanies
    | Necklace
    | RangedWeapon
    | Resource
    | Ring
    | Set
    | Tool;

type AllKeysOf<U> = U extends unknown ? keyof U : never;
type ValueForKey<U, K extends PropertyKey> = U extends unknown ? (K extends keyof U ? U[K] : never) : never;

export type UnifiedItem =
    { [K in keyof AllDaoTypes]: ValueForKey<AllDaoTypes, K> } &
    { [K in Exclude<AllKeysOf<AllDaoTypes>, keyof AllDaoTypes>]?: ValueForKey<AllDaoTypes, K> };

export type UnifiedItemsByVersion = Record<Version, Record<string, UnifiedItem | undefined>>;

type VersionedLookupStore<T> = Record<Version, Record<string, T | undefined>>;

const stores: Array<VersionedLookupStore<UnifiedItem>> = [
    Alchemies as unknown as VersionedLookupStore<Alchemy>,
    Ammos as unknown as VersionedLookupStore<Ammo>,
    Armors as unknown as VersionedLookupStore<Armor>,
    Backpacks as unknown as VersionedLookupStore<Backpack>,
    BuildingElements as unknown as VersionedLookupStore<BuildingElement>,
    Cannons as unknown as VersionedLookupStore<Cannon>,
    CrewEquipments as unknown as VersionedLookupStore<CrewEquipment>,
    Foods as unknown as VersionedLookupStore<Food>,
    HullModifications as unknown as VersionedLookupStore<HullModification>,
    Items as unknown as VersionedLookupStore<Item>,
    Medicines as unknown as VersionedLookupStore<Medicine>,
    MeleeWeapons as unknown as VersionedLookupStore<MeleeWeapon>,
    Metals as unknown as VersionedLookupStore<Metal>,
    Miscellaneous as unknown as VersionedLookupStore<Miscellanies>,
    Necklaces as unknown as VersionedLookupStore<Necklace>,
    RangedWeapons as unknown as VersionedLookupStore<RangedWeapon>,
    Resources as unknown as VersionedLookupStore<Resource>,
    Rings as unknown as VersionedLookupStore<Ring>,
    Sets as unknown as VersionedLookupStore<Set>,
    Tools as unknown as VersionedLookupStore<Tool>,
];

const unifiedItemsByVersion = {} as UnifiedItemsByVersion;

for (const version of Object.keys(Versions) as Version[]) {
    const unifiedById: Record<string, UnifiedItem | undefined> = {};

    for (const store of stores) {
        const entries = store[version];

        for (const [id, value] of Object.entries(entries)) {
            if (!value || unifiedById[id] !== undefined) {
                continue;
            }

            unifiedById[id] = value;
        }
    }

    unifiedItemsByVersion[version] = unifiedById;
}

export const UnifiedItems: UnifiedItemsByVersion = unifiedItemsByVersion;
