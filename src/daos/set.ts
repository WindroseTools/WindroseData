import setsData from "../../data/set.json";
import { Effect } from "../types/Effect";
import { SetType } from "../types/Set";
import { MultiVersion, Version } from "../versions";
import { createVersionedRawStore, instantiateVersionedEntries } from "./helpers";
import { RequirementUtils } from "./requirements";

type SetKey = keyof typeof setsData;
type SetData = {
    type: SetType;
    pieces: string[];
    pieceBonuses: Record<string, Effect[]>;
};

type SetsByVersion = MultiVersion<SetKey, Set>;

export class Set {
    public id: string;
    public type: SetType;
    public dataType: "set";
    public pieces: string[];
    public pieceBonuses: Record<string, Effect[]>;

    constructor(id: string, data: SetData) {
        this.id = id;
        this.type = data.type;
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

        RequirementUtils.registerLookupContext({
            getSet: (id, version) => setsByVersion[version][id as SetKey],
        });

        const resolvers = [
            ...RequirementUtils.createDefaultRequirementResolvers(),
        ];

        return setsByVersion;
    }
}

export const Sets: SetsByVersion = Set.loadSetsByVersion();