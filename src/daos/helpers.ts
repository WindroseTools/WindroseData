import { MultiVersion, Version, loadVersionedData } from "../versions";
import { RequirementEntry, RequirementResolver, RequirementUtils } from "./requirements";

type RawPayload<K extends string, TRaw> = {
    id: K;
    data: TRaw;
};

export function createVersionedRawStore<K extends string, TRaw>(
    dataByKey: Record<K, Partial<Record<Version, TRaw>>>,
): MultiVersion<K, RawPayload<K, TRaw>> {
    return loadVersionedData(
        dataByKey,
        (id, data) => ({
            id,
            data: { ...data },
        }),
    ) as MultiVersion<K, RawPayload<K, TRaw>>;
}

export function instantiateVersionedEntries<K extends string, TRaw, TEntity>(
    rawByVersion: MultiVersion<K, RawPayload<K, TRaw>>,
    createEntry: (id: K, data: TRaw, version: Version) => TEntity,
): MultiVersion<K, TEntity> {
    const entriesByVersion = {} as MultiVersion<K, TEntity>;

    for (const version of Object.keys(rawByVersion) as Version[]) {
        const versionEntries = {} as Partial<Record<K, TEntity>>;

        for (const [id, payload] of Object.entries(rawByVersion[version]) as Array<[K, RawPayload<K, TRaw>]>) {
            versionEntries[id] = createEntry(id, payload.data, version);
        }

        entriesByVersion[version] = versionEntries;
    }

    return entriesByVersion;
}

export function resolveVersionedRequirements<K extends string, TRaw, TEntity>(
    rawByVersion: MultiVersion<K, RawPayload<K, TRaw>>,
    entriesByVersion: MultiVersion<K, TEntity>,
    getRequired: (data: TRaw) => Record<string, number> | undefined,
    setRequired: (entity: TEntity, required: Record<string, RequirementEntry> | undefined) => void,
    resolvers: RequirementResolver[],
): void {
    for (const version of Object.keys(rawByVersion) as Version[]) {
        for (const [id, payload] of Object.entries(rawByVersion[version]) as Array<[K, RawPayload<K, TRaw>]>) {
            const entity = entriesByVersion[version][id];
            if (!entity) {
                continue;
            }

            const required = getRequired(payload.data);
            setRequired(
                entity,
                required
                    ? RequirementUtils.resolveRequiredEntries(required, version, resolvers)
                    : undefined,
            );
        }
    }
}