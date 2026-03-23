import { VersionKey } from "./versions";
import { Metals } from "./metals";
import { Resources } from "./resources";

export type ResolvedRequirement = {
    type: string;
    value: unknown;
};

export type RequirementResolver = (id: string, version: VersionKey) => ResolvedRequirement | undefined;

export type RequirementEntry = {
    id: string;
    amount: number;
    resolved?: ResolvedRequirement;
};

export class RequirementUtils {
    static readonly defaultRequirementResolvers: RequirementResolver[] = [
        (id, version) => {
            const metal = Metals[version][id as keyof typeof Metals[typeof version]];
            if (!metal) {
                return undefined;
            }

            return {
                type: "metal",
                value: metal,
            };
        },
        (id, version) => {
            const resource = Resources[version][id as keyof typeof Resources[typeof version]];
            if (!resource) {
                return undefined;
            }

            return {
                type: "resource",
                value: resource,
            };
        },
    ];

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