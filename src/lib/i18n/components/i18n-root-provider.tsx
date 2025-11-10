"use client";

import { NextIntlClientProvider } from "next-intl";

function I18nRootProvider({
	locale,
	...props
}: React.ComponentProps<typeof NextIntlClientProvider>) {
	return <NextIntlClientProvider locale={locale} {...props} />;
}

export { I18nRootProvider };
