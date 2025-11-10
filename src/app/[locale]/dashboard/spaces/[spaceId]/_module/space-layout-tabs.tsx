"use client";

import {
	LucideBanknote,
	LucideFolders,
	LucideLayoutDashboard,
	LucideMails,
	LucideUsers,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { LinkTabs } from "@/components/ui/tabs/link-tabs";
import type { LinkTab } from "@/components/ui/tabs/link-tabs.types";
import { routes } from "@/lib/routes";

function SpaceLayoutTabs({ spaceId }: { spaceId: string }) {
	const t = useTranslations();

	const tabs = useMemo<LinkTab[]>(
		() => [
			{
				value: "dashboard",
				href: routes.space.url({ id: spaceId }),
				title: t(`page-list.items.dashboard`),
				icon: <LucideLayoutDashboard />,
				isActive: "equals",
			},
			{
				value: "expenses",
				href: routes.space.expenses.url({ spaceId }),
				title: t(`page-list.items.expenses`),
				icon: <LucideBanknote />,
			},
			{
				value: "categories",
				href: routes.space.categories.url({ spaceId }),
				title: t(`page-list.items.categories`),
				icon: <LucideFolders />,
			},
			{
				value: "members",
				href: routes.space.members.url({ spaceId }),
				title: t(`page-list.items.members`),
				icon: <LucideUsers />,
			},
			{
				value: "invitations",
				href: routes.space.invitations.url({ spaceId }),
				title: t(`page-list.items.invitations`),
				icon: <LucideMails />,
			},
		],
		[t, spaceId]
	);

	return <LinkTabs tabs={tabs} />;
}

export { SpaceLayoutTabs };
