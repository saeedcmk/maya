import { LANGUAGES } from "../i18n-consts";
import type { Language } from "../types/language";
import type { Locale } from "../types/locale";

function getLanguage(locale: string): Language[Locale] {
	return LANGUAGES[locale as Locale];
}

export { getLanguage };
