import { SignUpClose } from "@/features/auth/components/signup-close";
import { SignUpForm } from "@/features/auth/components/signup-form";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function SignUpPage({
	searchParams,
}: {
	searchParams: Promise<{ debug?: boolean }>;
}) {
	const { debug = true } = await searchParams;

	const messages = await getPartialMessages([
		"features.auth.components.signup-form",
		"features.auth.components.signup-close",
	]);

	return (
		<I18nProvider messages={messages}>
			{debug ? <SignUpForm /> : <SignUpClose />}
		</I18nProvider>
	);
}

export default SignUpPage;
