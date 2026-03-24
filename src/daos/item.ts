import itemData from "../../data/item.json";
import { Rarity } from "../types/Rarity";
import { MultiVersion, VersionKey } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type ItemKey = keyof typeof itemData;
type ItemData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    required: Record<string, TRequired>;
};

type ItemRawData = ItemData<number>;
type ItemResolvedData = ItemData<RequirementEntry>;
type ItemsByVersion = MultiVersion<ItemKey, Item>;

export class Item {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: ItemResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.required = data.required;
    }

    static loadItemsByVersion(): ItemsByVersion {
        const rawByVersion = createVersionedRawStore(
            itemData as Record<ItemKey, Partial<Record<VersionKey, ItemRawData>>>,
        );
        const itemsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Item(id, { ...baseData, required: {} });
            },
        ) as ItemsByVersion;

        RequirementUtils.registerLookupContext({
            getItem: (id, version) => itemsByVersion[version][id as ItemKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            itemsByVersion,
            (data) => data.required,
            (item, required) => {
                item.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return itemsByVersion;
    }
}

export const Items: ItemsByVersion = Item.loadItemsByVersion();