import toolsData from "../../data/tool.json";
import { Damages, Station } from "../types/Common";
import { Rarity } from "../types/Rarity";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

type ToolKey = keyof typeof toolsData;
type ToolData<TRequired = number> = {
    rarity: Rarity;
    stackLimit: number;
    station?: Station;
    damages: Damages;
    attackPower: number;
    required: Record<string, TRequired>;
};

type ToolRawData = ToolData<number>;
type ToolResolvedData = ToolData<RequirementEntry>;

type ToolsByVersion = MultiVersion<ToolKey, Tool>;

export class Tool {
    public id: string;
    public dataType: "tool";
    public rarity: Rarity;
    public stackLimit: number;
    public station?: Station;
    public damages: Damages;
    public attackPower: number;
    public required: Record<string, RequirementEntry>;

    constructor(id: string, data: ToolResolvedData) {
        this.id = id;
        this.dataType = "tool";
        this.rarity = data.rarity;
        this.stackLimit = data.stackLimit;
        this.station = data.station;
        this.damages = data.damages;
        this.attackPower = data.attackPower;
        this.required = data.required;
    }

    static loadToolsByVersion(): ToolsByVersion {
        const rawByVersion = createVersionedRawStore(
            toolsData as Record<ToolKey, Partial<Record<Version, ToolRawData>>>,
        );
        const toolsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { required: _required, ...baseData } = data;

                return new Tool(id, { ...baseData, required: {} });
            },
        ) as ToolsByVersion;

        RequirementUtils.registerLookupContext({
            getTool: (id, version) => toolsByVersion[version][id as ToolKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        resolveVersionedRequirements(
            rawByVersion,
            toolsByVersion,
            (data) => data.required,
            (tool, required) => {
                tool.required = required ?? {};
            },
            resolvers,
        );

        return toolsByVersion;
    }
}

export const Tools: ToolsByVersion = Tool.loadToolsByVersion();