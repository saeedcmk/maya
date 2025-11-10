import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { LOCALES } from "./i18n-consts";

export default getRequestConfig(async ({ requestLocale }) => {
	const locale = await requestLocale;

	if (!locale || !LOCALES.some((x) => x === locale)) {
		notFound();
	}

	return {
		locale,
		messages: (await import(`../../../messages/${locale}.json`)).default,
		onError: () => {},
	};
});
