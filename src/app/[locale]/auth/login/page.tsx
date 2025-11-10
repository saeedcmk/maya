import { LoginForm } from "@/features/auth/components/login-form";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ debug?: boolean }>;
}) {
	const { debug = true } = await searchParams;

	const messages = await getPartialMessages([
		"features.auth.components.login-form",
	]);

	return (
		<I18nProvider messages={messages}>
			<LoginForm debug={debug} />
		</I18nProvider>
	);
}

export default LoginPage;
