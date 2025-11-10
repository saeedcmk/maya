import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CookiesProvider } from "@/components/app/cookie/cookies-provider";
import { DialogsProvider } from "@/components/app/dialog/dialogs-context";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { getSessionServer } from "@/features/auth/services/server/get-session-server";
import { QueryProvider } from "@/lib/data/react-query/query-provider";
import { DateProvider } from "@/lib/i18n/components/date-provider";
import { DirectionProvider } from "@/lib/i18n/components/direction-provider";
import { I18nRootProvider } from "@/lib/i18n/components/i18n-root-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function Providers({
	children,
	locale,
}: React.PropsWithChildren<{ locale: string }>) {
	const messages = await getPartialMessages([
		"shared.exprs",
		"shared.errors",
		{ path: "shared.components", spread: true },
		"features.user.types.user",
	]);

	const session = await getSessionServer();

	return (
		<CookiesProvider>
			<QueryProvider>
				<NuqsAdapter>
					<DirectionProvider locale={locale}>
						<I18nRootProvider locale={locale} messages={messages}>
							<DateProvider>
								<DialogsProvider>
									<AuthProvider session={session}>{children}</AuthProvider>
								</DialogsProvider>
							</DateProvider>
						</I18nRootProvider>
					</DirectionProvider>
				</NuqsAdapter>
			</QueryProvider>
		</CookiesProvider>
	);
}

export { Providers };
