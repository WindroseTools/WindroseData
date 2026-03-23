import toolsData from "../../data/tools.json";
import { Rarity } from "../types/Rarity";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";
import { RequirementEntry, RequirementResolver, RequirementUtils } from "./requirements";

type ToolKey = keyof typeof toolsData;
type ToolData = {
    id: string;
    rarity: Rarity;
    stackLimit: number;
    required: Record<string, number>;
};
export type ToolRequirement = RequirementEntry;

type ToolsByVersion = MultiVersion<ToolKey, Tool>;

export class Tool {
    constructor (
        public id: string,
        public rarity: Rarity,
        public stackLimit: number,
        public required: Record<string, ToolRequirement>,
    ) {}

    static loadToolsByVersion(resolvers: RequirementResolver[] = RequirementUtils.defaultRequirementResolvers): ToolsByVersion {
        return loadVersionedData(
            toolsData as Record<ToolKey, Partial<Record<VersionKey, ToolData>>>,
            (id, data, version) => {
                const required = RequirementUtils.resolveRequiredEntries(data.required, version, resolvers);

                return new Tool(id, data.rarity as Rarity, data.stackLimit, required);
            },
        ) as ToolsByVersion;
    }
}

export const Tools: ToolsByVersion = Tool.loadToolsByVersion();