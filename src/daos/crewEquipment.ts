import crewEquipmentData from "../../data/crewEquipment.json";
import { Station } from "../types/Common";
import { Effect } from "../types/Effect";
import { AttackLevels } from "../types/Level";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type CrewEquipmentKey = keyof typeof crewEquipmentData;
type CrewEquipmentData<TRequired = number> = {
    rarity: Rarity;
    station?: Station;
    required: Record<string, TRequired>;
    effects?: Effect[];
    levels: AttackLevels;
};

type CrewEquipmentRawData = CrewEquipmentData<number>;
type CrewEquipmentResolvedData = CrewEquipmentData<RequirementEntry>;
type CrewEquipmentsByVersion = MultiVersion<CrewEquipmentKey, CrewEquipment>;

export class CrewEquipment {
    public id: string;
    public dataType: "crewEquipment";
    public rarity: Rarity;
    public station?: Station;
    public required: Record<string, RequirementEntry>;
    public effects?: Effect[];
    public levels: AttackLevels;

    constructor(id: string, data: CrewEquipmentResolvedData) {
        this.id = id;
        this.dataType = "crewEquipment";
        this.rarity = data.rarity;
        this.station = data.station;
        this.required = data.required;
        this.effects = data.effects;
        this.levels = data.levels;
    }

    static loadCrewEquipmentByVersion(): CrewEquipmentsByVersion {
        const rawByVersion = createVersionedRawStore(
            crewEquipmentData as Record<CrewEquipmentKey, Partial<Record<Version, CrewEquipmentRawData>>>,
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