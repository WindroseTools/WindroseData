import resourcesData from "../../data/resources.json";
import { Rarity } from "../types/Rarity";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";
import { RequirementEntry, RequirementResolver, RequirementUtils } from "./requirements";

type ResourceKey = keyof typeof resourcesData;
type ResourceData<TRequired = number> = {
	rarity: Rarity;
	stackLimit: number;
	required?: Record<string, TRequired>;
};
type ResourceRawData = ResourceData<number>;
type ResourceResolvedData = ResourceData<RequirementEntry>;

type ResourcesByVersion = MultiVersion<ResourceKey, Resource>;

export class Resource {
	public id: string;
	public rarity: Rarity;
	public stackLimit: number;
	public required?: Record<string, RequirementEntry>;

	constructor(id: string, data: ResourceResolvedData) {
		this.id = id;
		this.rarity = data.rarity;
		this.stackLimit = data.stackLimit;
		this.required = data.required;
	}

	static loadResourcesByVersion(resolvers: RequirementResolver[] = RequirementUtils.defaultRequirementResolvers): ResourcesByVersion {
		return loadVersionedData(
			resourcesData as Record<ResourceKey, Partial<Record<VersionKey, ResourceRawData>>>,
			(id, data, version) => {
				const required = data.required
					? RequirementUtils.resolveRequiredEntries(data.required, version, resolvers)
					: undefined;

				return new Resource(id, { ...data, required });
			},
		) as ResourcesByVersion;
	}
}

export const Resources: ResourcesByVersion = Resource.loadResourcesByVersion();
