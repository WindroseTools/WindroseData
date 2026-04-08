import itemData from "../../data/item.json";
import { Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type ItemKey = keyof typeof itemData;
type ItemData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required: Record<string, TRequired>;
    effects?: Effect[];
};

type ItemRawData = ItemData<number>;
type ItemResolvedData = ItemData<RequirementEntry>;
type ItemsByVersion = MultiVersion<ItemKey, Item>;

export class Item {
    public id: string;
    public dataType: "item";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required: Record<string, RequirementEntry>;
    public effects?: Effect[];

    constructor(id: string, data: ItemResolvedData) {
        this.id = id;
        this.dataType = "item";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
        this.effects = data.effects;
    }

    static loadItemsByVersion(): ItemsByVersion {
        const rawByVersion = createVersionedRawStore(
            itemData as Record<ItemKey, Partial<Record<Version, ItemRawData>>>,
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