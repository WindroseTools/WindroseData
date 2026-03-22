// Source
import metals from '../languages/source/metals.json';

type LanguageData = {
    metals: typeof metals;
};

type LanguagesType = {
    EN: LanguageData;
};

export const Languages: LanguagesType = {
    EN: {
        metals: metals,
    }
};