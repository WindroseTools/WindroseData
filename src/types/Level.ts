export type Levels = Record<string, Level>;
export type Level = {
    required?: Record<string, number>;
}

export type AttackLevels = Record<string, AttackLevel>;
export type AttackLevel = Level & {
    attackPower: number;
}

export type DefenseLevels = Record<string, DefenseLevel>;
export type DefenseLevel = Level & {
    defenseScore: number;
}