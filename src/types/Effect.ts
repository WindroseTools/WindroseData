import effectsLanguageEntries from "../../languages/source/effects.json";

export type Effect = {
    "type": EffectType,
    [value: string]: unknown
}

export type EffectType = keyof typeof effectsLanguageEntries;