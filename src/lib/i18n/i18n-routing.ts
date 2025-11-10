import { defineRouting } from "next-intl/routing";
import {
	DEFAULT_LOCALE,
	LOCALE_COOKIE_NAME,
	LOCALE_COOKIE_TIME_IN_SECONDS,
	LOCALES,
} from "./i18n-consts";

const routing = defineRouting({
	defaultLocale: DEFAULT_LOCALE,
	localePrefix: "never",
	locales: LOCALES,
	localeCookie: {
		name: LOCALE_COOKIE_NAME,
		maxAge: LOCALE_COOKIE_TIME_IN_SECONDS,
	},
});

export { routing };
