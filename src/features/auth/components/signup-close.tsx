"use client";

import { useTranslations } from "next-intl";

function SignUpClose() {
	const t = useTranslations("signup-close");

	return <p>{t("message")}</p>;
}

export { SignUpClose };
