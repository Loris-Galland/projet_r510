export const LANGUAGES = {
  fr: "french",
  en: "english",
  jp: "japanese",
  cn: "chinese"
};

// langue par défaut
export let currentLang = "french";

// Permet de changer la langue courante
export function setLanguage(langCode) {
  if (LANGUAGES[langCode]) {
    currentLang = LANGUAGES[langCode];
    localStorage.setItem("lang", langCode); // sauvegarde choix user
  }
}

// Récupére la langue sauvegardée
export function initLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved && LANGUAGES[saved]) {
    currentLang = LANGUAGES[saved];
  }
}