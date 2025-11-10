import { LANGUAGES } from "../i18n-consts";
import type { Locale } from "../types/locale";

function getLanguageIntl(locale: string): string {
	return LANGUAGES[locale as Locale].intl ?? locale;
}

export { getLanguageIntl };
