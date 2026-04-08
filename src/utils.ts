import { LanguageData } from "./languages";
import { Effect } from "./types/Effect";

const replaceEffectPlaceholder = (text: string, effectData: Effect) => {
    Object.entries(effectData).filter(([key, value]) => key !== "type").forEach(([key, value]) => {
        text = text.replace(`{{${key}}}`, String(value));
    });
    return text;
}

export function populateEffectTranslation(effectData: Effect, effectTranslation: LanguageData): LanguageData {
    return {
        name: replaceEffectPlaceholder(effectTranslation.name, effectData),
        description: effectTranslation.description.map(paragraph => paragraph.map(line => replaceEffectPlaceholder(line, effectData))),
    }
}