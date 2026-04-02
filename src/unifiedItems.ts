import { Alchemies, Alchemy } from "./daos/alchemy";
import { Ammos, Ammo } from "./daos/ammo";
import { Backpacks, Backpack } from "./daos/backpack";
import { BuildingElement, BuildingElements } from "./daos/buildingElement";
import { Cannon, Cannons } from "./daos/cannon";
import { CrewEquipment, CrewEquipments } from "./daos/crewEquipment";
import { Food, Foods } from "./daos/food";
import { HullModification, HullModifications } from "./daos/hullModification";
import { Item, Items } from "./daos/item";
import { Medicine, Medicines } from "./daos/medicine";
import { Metal, Metals } from "./daos/metal";
import { Miscellanies, Miscellaneous } from "./daos/miscellaneous";
import { Resource, Resources } from "./daos/resource";
import { Tool, Tools } from "./daos/tool";
import { Version, Versions } from "./versions";

type AllDaoTypes =
    | Alchemy
    | Ammo
    | Backpack
    | BuildingElement
    | Cannon
    | CrewEquipment
    | Food
    | HullModification
    | Item
    | Medicine
    | Metal
    | Miscellanies
    | Resource
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
    Backpacks as unknown as VersionedLookupStore<Backpack>,
    BuildingElements as unknown as VersionedLookupStore<BuildingElement>,
    Cannons as unknown as VersionedLookupStore<Cannon>,
    CrewEquipments as unknown as VersionedLookupStore<CrewEquipment>,
    Foods as unknown as VersionedLookupStore<Food>,
    HullModifications as unknown as VersionedLookupStore<HullModification>,
    Items as unknown as VersionedLookupStore<Item>,
    Medicines as unknown as VersionedLookupStore<Medicine>,
    Metals as unknown as VersionedLookupStore<Metal>,
    Miscellaneous as unknown as VersionedLookupStore<Miscellanies>,
    Resources as unknown as VersionedLookupStore<Resource>,
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
