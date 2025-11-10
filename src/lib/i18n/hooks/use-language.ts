"use client";

import { useLocale } from "next-intl";
import { LANGUAGES } from "../i18n-consts";
import type { Language } from "../types/language";
import type { Locale } from "../types/locale";

type UseLanguageReturn = Required<Language[Locale]> & {
	locale: Locale;
};

function useLanguage(): UseLanguageReturn {
	const locale = useLocale() as Locale;
	const language = LANGUAGES[locale];

	return {
		locale,
		...language,
		intl: language.intl ?? locale,
	};
}

export { useLanguage };
