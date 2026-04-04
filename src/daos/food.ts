import foodData from "../../data/food.json";
import { Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type FoodKey = keyof typeof foodData;
type FoodData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required?: Record<string, TRequired>;
};

type FoodRawData = FoodData<number>;
type FoodResolvedData = FoodData<RequirementEntry>;
type FoodItemsByVersion = MultiVersion<FoodKey, Food>;

export class Food {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required?: Record<string, RequirementEntry>;

    constructor(id: string, data: FoodResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
    }

    static loadFoodItemsByVersion(): FoodItemsByVersion {
        const rawByVersion = createVersionedRawStore(
            foodData as Record<FoodKey, Partial<Record<Version, FoodRawData>>>,
        );
        const foodItemsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Food(id, baseData);
            },
        ) as FoodItemsByVersion;

        RequirementUtils.registerLookupContext({
            getFood: (id, version) => foodItemsByVersion[version][id as FoodKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            foodItemsByVersion,
            (data) => data.required,
            (foodItem, required) => {
                foodItem.required = required;
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return foodItemsByVersion;
    }
}

export const Foods: FoodItemsByVersion = Food.loadFoodItemsByVersion();