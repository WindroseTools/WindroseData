
export const Versions = {
    "demo": {
        index: 0,
        startDate: new Date("2026-02-17T00:00:00Z"),
        endDate: new Date("2026-04-13T23:59:59Z"),
    },
    "EA0_10": {
        index: 1,
        startDate: new Date("2026-04-14T00:00:00Z"),
        endDate: new Date("2026-12-30T23:59:59Z"),
    },
    "latest": {
        index: 1000
    }
};

export type Version = keyof typeof Versions;
export type MultiVersion<K extends string, TValue> = {
    [V in Version]: Partial<Record<K, TValue>>;
};

export function loadVersionedData<
    K extends string,
    TRaw,
    TResult,
>(
    dataByKey: Record<K, Partial<Record<Version, TRaw>>>,
    createEntry: (id: K, data: TRaw, version: Version) => TResult,
): MultiVersion<K, TResult> {
    const orderedVersions = (Object.entries(Versions) as Array<[Version, { index: number }]> )
        .map(([version, data]) => ({ version, index: data.index }))
        .sort((a, b) => a.index - b.index);

    const resolvedByVersion = {} as MultiVersion<K, TResult>;

    for (const { version, index } of orderedVersions) {
        const versionEntries: Partial<Record<K, TResult>> = {};

        for (const [id, entriesByVersion] of Object.entries(dataByKey) as Array<[K, Partial<Record<Version, TRaw>>]>) {
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