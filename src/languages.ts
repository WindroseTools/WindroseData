// EN/Source
import alchemy from "../languages/source/alchemy.json";
import ammo from "../languages/source/ammo.json";
import backpack from "../languages/source/backpack.json";
import buildingElements from "../languages/source/buildingElement.json";
import cannon from "../languages/source/cannon.json";
import crewEquipment from "../languages/source/crewEquipment.json";
import effects from "../languages/source/effects.json";
import food from "../languages/source/food.json";
import hullModification from "../languages/source/hullModification.json";
import item from "../languages/source/item.json";
import medicine from "../languages/source/medicine.json";
import metal from "../languages/source/metal.json";
import miscellaneous from "../languages/source/miscellaneous.json";
import resource from "../languages/source/resource.json";
import tool from "../languages/source/tool.json";

// DE
//import deMetal from "../languages/de/de_metal.json";

import { loadVersionedData, MultiVersion, Version } from "./versions";

const enLanguageEntries = {
    ...alchemy,
    ...ammo,
    ...backpack,
    ...buildingElements,
    ...cannon,
    ...crewEquipment,
    ...effects,
    ...food,
    ...hullModification,
    ...item,
    ...medicine,
    ...metal,
    ...miscellaneous,
    ...resource,
    ...tool,
};

const deLanguageEntries = {
    // ...deMetal,
};

type ENLanguageKey = keyof typeof enLanguageEntries;
type DELanguageKey = keyof typeof deLanguageEntries;
export type LanguageKey = ENLanguageKey | DELanguageKey;

export type LanguageData = {
    name: string;
    description: string[][];
    comment?: string[];
    usesIcon?: boolean;
    [key: string]: unknown;
};

type LanguagesByVersion = MultiVersion<LanguageKey, LanguageData>;

export type LanguageSet = {
    EN: LanguagesByVersion;
    // DE: LanguagesByVersion;
};

export function loadLanguagesByVersion(
    entries: Record<LanguageKey, Partial<Record<Version, LanguageData>>>,
): LanguagesByVersion {
    return loadVersionedData(
        entries,
        (_id, data) => ({ ...data }),
    ) as LanguagesByVersion;
}

export const Languages: LanguageSet = {
    EN: loadLanguagesByVersion(
        enLanguageEntries as Record<LanguageKey, Partial<Record<Version, LanguageData>>>,
    ),
};