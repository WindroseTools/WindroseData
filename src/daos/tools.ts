import toolsData from "../../data/tools.json";
import { Rarity } from "../types/Rarity";
import "./resources";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";
import { RequirementEntry, RequirementUtils } from "./requirements";

type ToolKey = keyof typeof toolsData;
type ToolData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    required: Record<string, TRequired>;
};

type ToolRawData = ToolData<number>;
type ToolResolvedData = ToolData<RequirementEntry>;

type ToolsByVersion = MultiVersion<ToolKey, Tool>;

export class Tool {
    public id: string;
    public rarity: Rarity;
    public stackLimit: number;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: ToolResolvedData) {
        this.id = id;
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.required = data.required;
    }

    static loadToolsByVersion(): ToolsByVersion {
        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        return loadVersionedData(
            toolsData as Record<ToolKey, Partial<Record<VersionKey, ToolRawData>>>,
            (id, data, version) => {
                const required = RequirementUtils.resolveRequiredEntries(data.required, version, resolvers);

                return new Tool(id, { ...data, required });
            },
        ) as ToolsByVersion;
    }
}

export const Tools: ToolsByVersion = Tool.loadToolsByVersion();