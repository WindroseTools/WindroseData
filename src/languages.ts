// Source
import metal from '../languages/source/metal.json';

type LanguageData = {
    metal: typeof metal;
};

type LanguagesType = {
    EN: LanguageData;
};

export const Languages: LanguagesType = {
    EN: {
        metal: metal,
    }
};