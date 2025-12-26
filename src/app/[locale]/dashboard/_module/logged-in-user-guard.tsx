"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";

function LoggedInUserGuard({ children }: React.PropsWithChildren) {
	const t = useTranslations();

	const { session } = useAuth();

	if (!session) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center">
				<Spinner label={t("redirect-to-login.label")} />
			</div>
		);
	}

	return children;
}

export { LoggedInUserGuard };
