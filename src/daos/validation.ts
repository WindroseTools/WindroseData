import { Alchemies } from "./alchemy";
import { Ammos } from "./ammo";
import { Backpacks } from "./backpack";
import { BuildingElements } from "./buildingElement";
import { Cannons } from "./cannon";
import { CrewEquipments } from "./crewEquipment";
import { Foods } from "./food";
import { HullModifications } from "./hullModification";
import { Items } from "./item";
import { Medicines } from "./medicine";
import { Metals } from "./metal";
import { Miscellaneous } from "./miscellaneous";
import { RequirementUtils } from "./requirements";
import { Resources } from "./resource";
import { Tools } from "./tool";

RequirementUtils.assertNoCircularDependencies([
    { type: "metal", entriesByVersion: Metals },
    { type: "resource", entriesByVersion: Resources },
    { type: "tool", entriesByVersion: Tools },
    { type: "alchemy", entriesByVersion: Alchemies },
    { type: "ammo", entriesByVersion: Ammos },
    { type: "backpack", entriesByVersion: Backpacks },
    { type: "buildingElement", entriesByVersion: BuildingElements },
    { type: "cannon", entriesByVersion: Cannons },
    { type: "crewEquipment", entriesByVersion: CrewEquipments },
    { type: "food", entriesByVersion: Foods },
    { type: "hullModification", entriesByVersion: HullModifications },
    { type: "item", entriesByVersion: Items },
    { type: "medicine", entriesByVersion: Medicines },
    { type: "miscellaneous", entriesByVersion: Miscellaneous },
]);