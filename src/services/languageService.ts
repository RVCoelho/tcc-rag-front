export type Lang = 'pt' | 'en' | string;

let currentLang: Lang = 'pt';

export const setLanguage = (lang: Lang) => {
  currentLang = lang;
};

export const getLanguage = () => currentLang;

export const getLanguageInstruction = (lang?: Lang) => {
  const l = lang ?? currentLang;
  switch (l) {
    case 'pt':
      return 'Responda em português.';
    case 'en':
      return 'Answer in English.';
    default:
      return `Responda em ${l}.`;
  }
};