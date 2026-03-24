
export const versions = {
    "demo": {
        index: 0,
        startDate: new Date("2024-06-01T00:00:00Z"), // Placeholder
        endDate: new Date("2024-06-30T23:59:59Z"), // Placeholder
    },
    "EA0.0.1": {
        index: 1,
        startDate: new Date("2024-07-01T00:00:00Z"), // Placeholder
        endDate: new Date("2024-07-31T23:59:59Z"), // Placeholder
    }
};

export type VersionKey = keyof typeof versions;
export type MultiVersion<K extends string, TValue> = {
    [V in VersionKey]: Partial<Record<K, TValue>>;
};

export function loadVersionedData<
    K extends string,
    TRaw,
    TResult,
>(
    dataByKey: Record<K, Partial<Record<VersionKey, TRaw>>>,
    createEntry: (id: K, data: TRaw, version: VersionKey) => TResult,
): MultiVersion<K, TResult> {
    const orderedVersions = (Object.entries(versions) as Array<[VersionKey, { index: number }]> )
        .map(([version, data]) => ({ version, index: data.index }))
        .sort((a, b) => a.index - b.index);

    const resolvedByVersion = {} as MultiVersion<K, TResult>;

    for (const { version, index } of orderedVersions) {
        const versionEntries: Partial<Record<K, TResult>> = {};

        for (const [id, entriesByVersion] of Object.entries(dataByKey) as Array<[K, Partial<Record<VersionKey, TRaw>>]>) {
            const fallback = [...orderedVersions]
                .reverse()
                .find((candidate) => candidate.index <= index && entriesByVersion[candidate.version] !== undefined);

            if (!fallback) {
                continue;
            }

            versionEntries[id] = createEntry(id, entriesByVersion[fallback.version]!, version);
        }

        resolvedByVersion[version] = versionEntries;
    }

    return resolvedByVersion;
}