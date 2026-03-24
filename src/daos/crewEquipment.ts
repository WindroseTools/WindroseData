import crewEquipmentData from "../../data/crewEquipment.json";
import { Rarity } from "../types/Rarity";
import { MultiVersion, VersionKey } from "../versions";
import "./resource";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type CrewEquipmentKey = keyof typeof crewEquipmentData;
type CrewEquipmentData<TRequired = number> = {
    rarity: Rarity;
    required: Record<string, TRequired>;
};

type CrewEquipmentRawData = CrewEquipmentData<number>;
type CrewEquipmentResolvedData = CrewEquipmentData<RequirementEntry>;
type CrewEquipmentsByVersion = MultiVersion<CrewEquipmentKey, CrewEquipment>;

export class CrewEquipment {
    public id: string;
    public rarity: Rarity;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: CrewEquipmentResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.required = data.required;
    }

    static loadCrewEquipmentByVersion(): CrewEquipmentsByVersion {
        const rawByVersion = createVersionedRawStore(
            crewEquipmentData as Record<CrewEquipmentKey, Partial<Record<VersionKey, CrewEquipmentRawData>>>,
        );
        const crewEquipmentByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new CrewEquipment(id, { ...baseData, required: {} });
            },
        ) as CrewEquipmentsByVersion;

        RequirementUtils.registerLookupContext({
            getCrewEquipment: (id, version) => crewEquipmentByVersion[version][id as CrewEquipmentKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            crewEquipmentByVersion,
            (data) => data.required,
            (crewEquipment, required) => {
                crewEquipment.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return crewEquipmentByVersion;
    }
}

export const CrewEquipments: CrewEquipmentsByVersion = CrewEquipment.loadCrewEquipmentByVersion();