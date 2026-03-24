import resourcesData from "../../data/resource.json";
import { Rarity } from "../types/Rarity";
import "./metal";
import { MultiVersion, VersionKey } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries, resolveVersionedRequirements } from "./helpers";
import { RequirementEntry, RequirementUtils } from "./requirements";

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

	static loadResourcesByVersion(): ResourcesByVersion {
		const rawByVersion = createVersionedRawStore(
			resourcesData as Record<ResourceKey, Partial<Record<VersionKey, ResourceRawData>>>,
		);
		const resourcesByVersion = instantiateVersionedEntries(
			rawByVersion,
			(id, data) => {
				const { required: _required, ...baseData } = data;

				return new Resource(id, baseData);
			},
		) as ResourcesByVersion;

		RequirementUtils.registerLookupContext({
			getResource: (id, version) => resourcesByVersion[version][id as ResourceKey],
		});

		const resolvers = [
			...RequirementUtils.createDefaultRequirementResolvers(),
		];

		resolveVersionedRequirements(
			rawByVersion,
			resourcesByVersion,
			(data) => data.required,
			(resource, required) => {
				resource.required = required;
			},
			resolvers,
		);

		return resourcesByVersion;
	}
}

export const Resources: ResourcesByVersion = Resource.loadResourcesByVersion();
