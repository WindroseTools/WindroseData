import buildingElementData from "../../data/buildingElement.json";
import { BEType } from "../types/BuildingElement";
import { MultiVersion, VersionKey } from "../versions";
import "./miscellaneous";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type BuildingElementKey = keyof typeof buildingElementData;
type BuildingElementData<TRequired = number> = {
    type: BEType;
    limit?: number;
    required: Record<string, TRequired>;
};

type BuildingElementRawData = BuildingElementData<number>;
type BuildingElementResolvedData = BuildingElementData<RequirementEntry>;
type BuildingElementsByVersion = MultiVersion<BuildingElementKey, BuildingElement>;

export class BuildingElement {
    public id: string;
    public type: BEType;
    public limit?: number;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: BuildingElementResolvedData) {
        this.id = id;
        this.type = data.type;
        this.limit = data.limit;
        this.required = data.required;
    }

    static loadBuildingElementsByVersion(): BuildingElementsByVersion {
        const rawByVersion = createVersionedRawStore(
            buildingElementData as Record<BuildingElementKey, Partial<Record<VersionKey, BuildingElementRawData>>>,
        );
        const buildingElementsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new BuildingElement(id, { ...baseData, required: {} });
            },
        ) as BuildingElementsByVersion;

        RequirementUtils.registerLookupContext({
            getBuildingElement: (id, version) => buildingElementsByVersion[version][id as BuildingElementKey],
        });

        resolveVersionedRequirements(
            rawByVersion,
            buildingElementsByVersion,
            (data) => data.required,
            (buildingElement, required) => {
                buildingElement.required = required ?? {};
            },
            RequirementUtils.createDefaultRequirementResolvers(),
        );

        return buildingElementsByVersion;
    }
}

export const BuildingElements: BuildingElementsByVersion = BuildingElement.loadBuildingElementsByVersion();