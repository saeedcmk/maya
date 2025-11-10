import type { Language } from "./types/language";
import type { Locale } from "./types/locale";

const LANGUAGES: Language = {
	en: {
		label: "English",
		flag: "US",
		calendar: "gregorian",
	},
	fa: {
		label: "فارسی",
		flag: "IR",
		calendar: "jalali",
		intl: "fa-IR-u-nu-latn",
	},
};

const DEFAULT_LOCALE: Locale = "en";
const LOCALES: Locale[] = ["en", "fa"];

const LOCALE_COOKIE_NAME = process.env.LOCALE_COOKIE_NAME || "locale";
const LOCALE_COOKIE_TIME_IN_SECONDS = 60 * 60 * 24 * 365; // 1y

export {
	DEFAULT_LOCALE,
	LANGUAGES,
	LOCALE_COOKIE_NAME,
	LOCALE_COOKIE_TIME_IN_SECONDS,
	LOCALES,
};
