import { VersionKey } from "../versions";

export type ResolvedRequirement = {
    type: string;
    value: unknown;
};

export type RequirementResolver = (id: string, version: VersionKey) => ResolvedRequirement | undefined;

type RequirementLookupContext = {
    getMetal?: (id: string, version: VersionKey) => unknown;
    getResource?: (id: string, version: VersionKey) => unknown;
};

export type RequirementEntry = {
    id: string;
    amount: number;
    resolved?: ResolvedRequirement;
};

export class RequirementUtils {
    private static lookupContext: RequirementLookupContext = {};

    static registerLookupContext(context: RequirementLookupContext): void {
        RequirementUtils.lookupContext = {
            ...RequirementUtils.lookupContext,
            ...context,
        };
    }

    static createDefaultRequirementResolvers(): RequirementResolver[] {
        return [
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
                const resource = RequirementUtils.lookupContext.getResource?.(id, version);
                if (!resource) {
                    return undefined;
                }

                return {
                    type: "resource",
                    value: resource,
                };
            },
        ];
    }

    static resolveRequirement(
        id: string,
        version: VersionKey,
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
        version: VersionKey,
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

        return resolvedRequired;
    }
}