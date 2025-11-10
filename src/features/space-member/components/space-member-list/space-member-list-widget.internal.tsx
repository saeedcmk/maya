"use client";

import { useTranslations } from "next-intl";
import {
	Card,
	CardBody,
	CardHeader,
	CardInfo,
	CardTitle,
} from "@/components/ui/card";
import { SpaceMemberListTable } from "./space-member-list-table.internal";

function SpaceMemberListWidget() {
	const t = useTranslations();

	return (
		<Card>
			<CardHeader>
				<CardInfo>
					<CardTitle>{t("space-member-list.title")}</CardTitle>
				</CardInfo>
			</CardHeader>

			<CardBody>
				<SpaceMemberListTable />
			</CardBody>
		</Card>
	);
}

export { SpaceMemberListWidget };
