import medicineData from "../../data/medicine.json";
import { Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type MedicineKey = keyof typeof medicineData;
type MedicineData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    required: Record<string, TRequired>;
    effects?: Effect[];
};

type MedicineRawData = MedicineData<number>;
type MedicineResolvedData = MedicineData<RequirementEntry>;
type MedicinesByVersion = MultiVersion<MedicineKey, Medicine>;

export class Medicine {
    public id: string;
    public dataType: "medicine";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public required: Record<string, RequirementEntry>;
    public effects?: Effect[];

    constructor(id: string, data: MedicineResolvedData) {
        this.id = id;
        this.dataType = "medicine";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.required = data.required;
        this.effects = data.effects;
    }

    static loadMedicinesByVersion(): MedicinesByVersion {
        const rawByVersion = createVersionedRawStore(
            medicineData as Record<MedicineKey, Partial<Record<Version, MedicineRawData>>>,
        );
        const medicinesByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Medicine(id, { ...baseData, required: {} });
            },
        ) as MedicinesByVersion;

        RequirementUtils.registerLookupContext({
            getMedicine: (id, version) => medicinesByVersion[version][id as MedicineKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            medicinesByVersion,
            (data) => data.required,
            (medicine, required) => {
                medicine.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return medicinesByVersion;
    }
}

export const Medicines: MedicinesByVersion = Medicine.loadMedicinesByVersion();