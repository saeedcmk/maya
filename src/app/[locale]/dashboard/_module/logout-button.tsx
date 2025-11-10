"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { logout } from "@/features/auth/services/logout";

function LogoutButton() {
	const router = useRouter();

	const t = useTranslations();

	const [isPending, setIsPending] = useState<boolean>(false);

	async function handleClick() {
		try {
			setIsPending(true);

			await logout();

			router.push("/auth/login");
		} catch {
			setIsPending(false);
		}
	}

	return (
		<Button color="destructive" variant="contained" onClick={handleClick}>
			<Spinner loading={isPending} color="white" size="sm">
				{t("logout-button.label")}
			</Spinner>
		</Button>
	);
}

export { LogoutButton };
