"use client";

import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";

function I18nProvider({
	locale: propLocale,
	messages: m1,
	onError,
	...props
}: React.ComponentProps<typeof NextIntlClientProvider>) {
	const defaultLocale = useLocale();
	const locale = propLocale || defaultLocale;

	const m2 = useMessages();
	const messages = { ...(m1 ?? {}), ...(m2 ?? {}) };

	return (
		<NextIntlClientProvider
			locale={locale}
			messages={messages}
			onError={onError ? onError : messages ? () => {} : undefined}
			{...props}
		/>
	);
}

export { I18nProvider };
