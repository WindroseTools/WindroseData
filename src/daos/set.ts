import setsData from "../../data/set.json";
import { Effect } from "../types/Effect";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries } from "./helpers";

type SetKey = keyof typeof setsData;
type SetData = {
    pieces: string[];
    pieceBonuses: Record<string, Effect[]>;
};

type SetsByVersion = MultiVersion<SetKey, Set>;

export class Set {
    public id: string;
    public dataType: "set";
    public pieces: string[];
    public pieceBonuses: Record<string, Effect[]>;

    constructor(id: string, data: SetData) {
        this.id = id;
        this.dataType = "set";
        this.pieces = data.pieces;
        this.pieceBonuses = data.pieceBonuses;
    }

    static loadSetsByVersion(): SetsByVersion {
        const rawByVersion = createVersionedRawStore(
            setsData as Record<SetKey, Partial<Record<Version, SetData>>>,
        );
        const setsByVersion = instantiateVersionedEntries(
            rawByVersion,
            (id, data) => {
                const { pieces: _pieces, ...baseData } = data;

                return new Set(id, { ...baseData, pieces: [] });
            },
        ) as SetsByVersion;

        return setsByVersion;
    }
}

export const Sets: SetsByVersion = Set.loadSetsByVersion();