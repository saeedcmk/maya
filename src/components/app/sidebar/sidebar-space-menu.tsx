"use client";

import { useQuery } from "@tanstack/react-query";
import { LucideBox, LucidePlus } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessages, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SpaceType } from "@/features/space/enums/space-type";
import type { SpaceFindManyArgs } from "@/features/space/models/space-find-many";
import { findManySpace } from "@/features/space/services/find-many-space";
import type { SpaceLookup } from "@/features/space/types/space-lookup";
import { routes } from "@/lib/routes";

const SpaceCreateDialog = dynamic(
	() => import("@/features/space/components/space-create")
);

function SidebarSpaceMenu({
	spaces: initialData,
	onItemClick,
}: {
	spaces: SpaceLookup[];
	onItemClick: (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		url: string
	) => void;
}) {
	const queryArgs = {
		orderBy: { name: "asc" },
		select: { id: true, name: true, type: true },
	} satisfies SpaceFindManyArgs;

	const { data: spaces } = useQuery({
		queryKey: ["spaces", "root", queryArgs],
		queryFn: async () => await findManySpace(queryArgs),
		initialData,
		staleTime: Infinity,
	});

	const personalSpaces = useMemo(
		() => spaces?.filter((x) => x.type === SpaceType.PERSONAL),
		[spaces]
	);

	const groupSpaces = useMemo(
		() => spaces?.filter((x) => x.type === SpaceType.GROUP),
		[spaces]
	);

	return (
		<>
			<SpaceList
				type={SpaceType.PERSONAL}
				items={personalSpaces}
				onItemClick={onItemClick}
			/>

			<SpaceList
				type={SpaceType.GROUP}
				items={groupSpaces}
				onItemClick={onItemClick}
			/>
		</>
	);
}

function SpaceList({
	type,
	items,
	onItemClick,
}: {
	type: SpaceType;
	items: SpaceLookup[] | undefined;
	onItemClick: React.ComponentProps<typeof SidebarSpaceMenu>["onItemClick"];
}) {
	const router = useRouter();
	const dialogs = useDialogs();

	const t = useTranslations();
	const messages = useMessages();

	const handleCreateButtonClick = useCallback(async () => {
		const result = await dialogs.open(
			SpaceCreateDialog,
			{ type },
			{ messages }
		);

		if (result) {
			router.push(routes.space.url({ id: result.id }));
		}
	}, [router, dialogs, messages, type]);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>
				{t(`sidebar.space-menu.${type.toLowerCase()}-space.title`)}
			</SidebarGroupLabel>

			<SidebarGroupContent>
				<SidebarMenu>
					{!items || !items.length ? (
						<SidebarMenuItem>
							<SidebarMenuButton
								className="cursor-pointer px-2.5 md:h-8 md:px-2"
								onClick={handleCreateButtonClick}
							>
								<LucidePlus
									absoluteStrokeWidth
									className="size-5!"
									strokeWidth={1.5}
								/>
								<span>{t(`sidebar.space-menu.shared.actions.create`)}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					) : (
						items.map((space) => (
							<SpaceItem key={space.id} space={space} onClick={onItemClick} />
						))
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function SpaceItem({
	space,
	onClick,
}: {
	space: SpaceLookup;
	onClick: React.ComponentProps<typeof SidebarSpaceMenu>["onItemClick"];
}) {
	const url = routes.space.url({ id: space.id });

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild className="px-2.5 md:h-8 md:px-2">
				<Link
					href={url}
					prefetch={false}
					onClick={(event) => onClick(event, url)}
				>
					<LucideBox
						absoluteStrokeWidth
						className="size-5!"
						strokeWidth={1.5}
					/>
					<span>{space.name}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export { SidebarSpaceMenu };
