import resourcesData from "../../data/resources.json";
import { Rarity } from "../types/Rarity";
import { loadVersionedData, MultiVersion, VersionKey } from "./versions";

type ResourceKey = keyof typeof resourcesData;
type ResourceData = {
	id: string;
	rarity: Rarity;
	stackLimit: number;
	required?: Record<string, number>;
};

type ResourcesByVersion = MultiVersion<ResourceKey, Resource>;

export class Resource {
	constructor (
		public id: string,
		public rarity: Rarity,
		public stackLimit: number,
		public required?: Record<string, number>,
	) {}

	static loadResourcesByVersion(): ResourcesByVersion {
		return loadVersionedData(
			resourcesData as Record<ResourceKey, Partial<Record<VersionKey, ResourceData>>>,
			(id, data) => new Resource(id, data.rarity as Rarity, data.stackLimit, data.required),
		) as ResourcesByVersion;
	}
}

export const Resources: ResourcesByVersion = Resource.loadResourcesByVersion();
