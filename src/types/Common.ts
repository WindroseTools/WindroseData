import { BuildingElement } from "../daos/buildingElement";

export type Station = {
    id: string;
    level?: number;
};

export type Levels = Record<string, Level>;
export type Level = {
    "requiresBonfire"?: boolean;
    "requiredAddons"?: BuildingElement["id"][];
}