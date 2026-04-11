import { MultiVersion, Version } from "../versions";

export type ResolvedRequirement = {
    type: string;
    value: unknown;
};

export type RequirementResolver = (id: string, version: Version) => ResolvedRequirement | undefined;

type RequirementLookupContext = {
    getAlchemy?: (id: string, version: Version) => unknown;
    getAmmo?: (id: string, version: Version) => unknown;
    getArmor?: (id: string, version: Version) => unknown;
    getBackpack?: (id: string, version: Version) => unknown;
    getBuildingElement?: (id: string, version: Version) => unknown;
    getCannon?: (id: string, version: Version) => unknown;
    getCrewEquipment?: (id: string, version: Version) => unknown;
    getFood?: (id: string, version: Version) => unknown;
    getHullModification?: (id: string, version: Version) => unknown;
    getItem?: (id: string, version: Version) => unknown;
    getMedicine?: (id: string, version: Version) => unknown;
    getMeleeWeapon?: (id: string, version: Version) => unknown;
    getMetal?: (id: string, version: Version) => unknown;
    getMiscellaneous?: (id: string, version: Version) => unknown;
    getNecklace?: (id: string, version: Version) => unknown;
    getRangedWeapon?: (id: string, version: Version) => unknown;
    getResource?: (id: string, version: Version) => unknown;
    getRing?: (id: string, version: Version) => unknown;
    getSet?: (id: string, version: Version) => unknown;
    getTool?: (id: string, version: Version) => unknown;
};

type CircularDependencyNode = {
    id: string;
    required?: Record<string, RequirementEntry>;
};

type CircularDependencyCollection = {
    type: string;
    entriesByVersion: MultiVersion<any, CircularDependencyNode>;
};

export type RequirementEntry = {
    id: string;
    amount: number;
    resolved?: ResolvedRequirement;
};

export class RequirementUtils {
    private static lookupContext: RequirementLookupContext = {};
    private static trackedRequirementEntries: Array<{
        version: Version;
        entries: Record<string, RequirementEntry>;
    }> = [];

    static registerLookupContext(context: RequirementLookupContext): void {
        RequirementUtils.lookupContext = {
            ...RequirementUtils.lookupContext,
            ...context,
        };

        RequirementUtils.refreshTrackedRequirementEntries();
    }

    static createDefaultRequirementResolvers(): RequirementResolver[] {
        return [
            (id, version) => {
                const alchemy = RequirementUtils.lookupContext.getAlchemy?.(id, version);
                if (!alchemy) {
                    return undefined;
                }

                return {
                    type: "alchemy",
                    value: alchemy,
                };
            },
            (id, version) => {
                const ammo = RequirementUtils.lookupContext.getAmmo?.(id, version);
                if (!ammo) {
                    return undefined;
                }

                return {
                    type: "ammo",
                    value: ammo,
                };
            },
            (id, version) => {
                const armor = RequirementUtils.lookupContext.getArmor?.(id, version);
                if (!armor) {
                    return undefined;
                }

                return {
                    type: "armor",
                    value: armor,
                };
            },
            (id, version) => {
                const ammo = RequirementUtils.lookupContext.getAmmo?.(id, version);
                if (!ammo) {
                    return undefined;
                }

                return {
                    type: "ammo",
                    value: ammo,
                };
            },
            (id, version) => {
                const backpack = RequirementUtils.lookupContext.getBackpack?.(id, version);
                if (!backpack) {
                    return undefined;
                }

                return {
                    type: "backpack",
                    value: backpack,
                };
            },
            (id, version) => {
                const buildingElement = RequirementUtils.lookupContext.getBuildingElement?.(id, version);
                if (!buildingElement) {
                    return undefined;
                }

                return {
                    type: "buildingElement",
                    value: buildingElement,
                };
            },
            (id, version) => {
                const cannon = RequirementUtils.lookupContext.getCannon?.(id, version);
                if (!cannon) {
                    return undefined;
                }

                return {
                    type: "cannon",
                    value: cannon,
                };
            },
            (id, version) => {
                const crewEquipment = RequirementUtils.lookupContext.getCrewEquipment?.(id, version);
                if (!crewEquipment) {
                    return undefined;
                }

                return {
                    type: "crewEquipment",
                    value: crewEquipment,
                };
            },
            (id, version) => {
                const food = RequirementUtils.lookupContext.getFood?.(id, version);
                if (!food) {
                    return undefined;
                }

                return {
                    type: "food",
                    value: food,
                };
            },
            (id, version) => {
                const hullModification = RequirementUtils.lookupContext.getHullModification?.(id, version);
                if (!hullModification) {
                    return undefined;
                }

                return {
                    type: "hullModification",
                    value: hullModification,
                };
            },
            (id, version) => {
                const item = RequirementUtils.lookupContext.getItem?.(id, version);
                if (!item) {
                    return undefined;
                }

                return {
                    type: "item",
                    value: item,
                };
            },
            (id, version) => {
                const medicine = RequirementUtils.lookupContext.getMedicine?.(id, version);
                if (!medicine) {
                    return undefined;
                }

                return {
                    type: "medicine",
                    value: medicine,
                };
            },
            (id, version) => {
                const meleeWeapon = RequirementUtils.lookupContext.getMeleeWeapon?.(id, version);
                if (!meleeWeapon) {
                    return undefined;
                }

                return {
                    type: "meleeWeapon",
                    value: meleeWeapon,
                };
            },
            (id, version) => {
                const metal = RequirementUtils.lookupContext.getMetal?.(id, version);
                if (!metal) {
                    return undefined;
                }

                return {
                    type: "metal",
                    value: metal,
                };
            },
            (id, version) => {
                const miscellaneous = RequirementUtils.lookupContext.getMiscellaneous?.(id, version);
                if (!miscellaneous) {
                    return undefined;
                }

                return {
                    type: "miscellaneous",
                    value: miscellaneous,
                };
            },
            (id, version) => {
                const necklace = RequirementUtils.lookupContext.getNecklace?.(id, version);
                if (!necklace) {
                    return undefined;
                }

                return {
                    type: "necklace",
                    value: necklace,
                };
            },
            (id, version) => {
                const rangedWeapon = RequirementUtils.lookupContext.getRangedWeapon?.(id, version);
                if (!rangedWeapon) {
                    return undefined;
                }

                return {
                    type: "rangedWeapon",
                    value: rangedWeapon,
                };
            },
            (id, version) => {
                const resource = RequirementUtils.lookupContext.getResource?.(id, version);
                if (!resource) {
                    return undefined;
                }

                return {
                    type: "resource",
                    value: resource,
                };
            },
            (id, version) => {
                const ring = RequirementUtils.lookupContext.getRing?.(id, version);
                if (!ring) {
                    return undefined;
                }

                return {
                    type: "ring",
                    value: ring,
                };
            },
            (id, version) => {
                const set = RequirementUtils.lookupContext.getSet?.(id, version);
                if (!set) {
                    return undefined;
                }

                return {
                    type: "set",
                    value: set,
                };
            },
            (id, version) => {
                const tool = RequirementUtils.lookupContext.getTool?.(id, version);
                if (!tool) {
                    return undefined;
                }

                return {
                    type: "tool",
                    value: tool,
                };
            },
        ];
    }

    static assertNoCircularDependencies(collections: CircularDependencyCollection[]): void {
        const versions = new Set<Version>();

        for (const collection of collections) {
            for (const version of Object.keys(collection.entriesByVersion) as Version[]) {
                versions.add(version);
            }
        }

        for (const version of versions) {
            const collectionsByType = new Map(
                collections.map((collection) => [collection.type, collection.entriesByVersion[version] ?? {}]),
            );
            const visited = new Set<string>();
            const visiting = new Set<string>();
            const path: string[] = [];

            const visitNode = (type: string, node: CircularDependencyNode): void => {
                const key = `${type}:${node.id}`;
                if (visiting.has(key)) {
                    const cycleStart = path.indexOf(key);
                    const cyclePath = [...path.slice(cycleStart), key].join(" -> ");

                    throw new Error(`Circular requirement dependency detected for ${version}: ${cyclePath}`);
                }

                if (visited.has(key)) {
                    return;
                }

                visiting.add(key);
                path.push(key);

                for (const entry of Object.values(node.required ?? {})) {
                    const resolved = entry.resolved;
                    if (!resolved || !RequirementUtils.isCircularDependencyNode(resolved.value)) {
                        continue;
                    }

                    const targetEntries = collectionsByType.get(resolved.type);
                    const targetNode = targetEntries?.[resolved.value.id];
                    if (targetNode) {
                        visitNode(resolved.type, targetNode);
                    }
                }

                path.pop();
                visiting.delete(key);
                visited.add(key);
            };

            for (const collection of collections) {
                for (const node of Object.values(collection.entriesByVersion[version] ?? {})) {
                    if (node) {
                        visitNode(collection.type, node);
                    }
                }
            }
        }
    }

    static resolveRequirement(
        id: string,
        version: Version,
        resolvers: RequirementResolver[],
    ): ResolvedRequirement | undefined {
        for (const resolver of resolvers) {
            const resolved = resolver(id, version);
            if (resolved) {
                return resolved;
            }
        }

        return undefined;
    }

    static resolveRequiredEntries(
        required: Record<string, number>,
        version: Version,
        resolvers: RequirementResolver[],
    ): Record<string, RequirementEntry> {
        const resolvedRequired: Record<string, RequirementEntry> = {};

        for (const [id, amount] of Object.entries(required)) {
            resolvedRequired[id] = {
                id,
                amount,
                resolved: RequirementUtils.resolveRequirement(id, version, resolvers),
            };
        }

        RequirementUtils.trackedRequirementEntries.push({
            version,
            entries: resolvedRequired,
        });

        return resolvedRequired;
    }

    private static refreshTrackedRequirementEntries(): void {
        const resolvers = RequirementUtils.createDefaultRequirementResolvers();

        for (const tracked of RequirementUtils.trackedRequirementEntries) {
            for (const entry of Object.values(tracked.entries)) {
                entry.resolved = RequirementUtils.resolveRequirement(entry.id, tracked.version, resolvers);
            }
        }
    }

    private static isCircularDependencyNode(value: unknown): value is CircularDependencyNode {
        return typeof value === "object"
            && value !== null
            && "id" in value
            && typeof (value as { id: unknown }).id === "string";
    }
}