import resourcesData from "../../data/resources.json";
import { Rarity } from "../types/Rarity";
import "./metals";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";
import { RequirementEntry, RequirementUtils } from "./requirements";

type ResourceKey = keyof typeof resourcesData;
type ResourceData<TRequired = number> = {
	rarity: Rarity;
	stackLimit: number;
	required?: Record<string, TRequired>;
};
type ResourceRawData = ResourceData<number>;
type ResourceResolvedData = ResourceData<RequirementEntry>;
type ResolvedResourcePayload = {
	id: ResourceKey;
	data: ResourceRawData;
};

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
		const rawByVersion = loadVersionedData(
			resourcesData as Record<ResourceKey, Partial<Record<VersionKey, ResourceRawData>>>,
			(id, data) => ({
				id,
				data: { ...data },
			}),
		) as MultiVersion<ResourceKey, ResolvedResourcePayload>;

		const resourcesByVersion = {} as ResourcesByVersion;

		for (const version of Object.keys(rawByVersion) as VersionKey[]) {
			const entries = rawByVersion[version];
			const resourceEntries: Partial<Record<ResourceKey, Resource>> = {};

			for (const [id, payload] of Object.entries(entries) as Array<[ResourceKey, ResolvedResourcePayload]>) {
				const { required: _required, ...baseData } = payload.data;
				resourceEntries[id] = new Resource(payload.id, baseData);
			}

			resourcesByVersion[version] = resourceEntries;
		}

		RequirementUtils.registerLookupContext({
			getResource: (id, version) => resourcesByVersion[version][id as ResourceKey],
		});

		const resolvers = [
			...RequirementUtils.createDefaultRequirementResolvers(),
		];

		for (const version of Object.keys(rawByVersion) as VersionKey[]) {
			const entries = rawByVersion[version];

			for (const [id, payload] of Object.entries(entries) as Array<[ResourceKey, ResolvedResourcePayload]>) {
				const required = payload.data.required
					? RequirementUtils.resolveRequiredEntries(payload.data.required, version, resolvers)
					: undefined;

				const resource = resourcesByVersion[version][id];
				if (resource) {
					resource.required = required;
				}
			}
		}

		return resourcesByVersion;
	}
}

export const Resources: ResourcesByVersion = Resource.loadResourcesByVersion();
