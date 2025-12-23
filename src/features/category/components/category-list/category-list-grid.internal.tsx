"use client";

import { LucidePenSquare, LucideTrash } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/button/icon-button";
import { IconButtonGroup } from "@/components/ui/button/icon-button-group";
import { Card, CardContent } from "@/components/ui/card";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import { useCategoryListContext } from "./category-list-context.internal";

function CategoryListGrid() {
	const t = useTranslations();

	const { isOwnerOrAdmin } = useSpaceContext();

	const canEdit = isOwnerOrAdmin;
	const canDelete = isOwnerOrAdmin;
	const hasActions = canEdit || canDelete;

	const {
		isLoading,
		items: categories,
		openUpsertDialog,
		openDeleteDialog,
	} = useCategoryListContext();

	return (
		<div className="animate-in fade-in grid gap-2 duration-500">
			{categories?.map((category) => (
				<Card
					key={category.id}
					className="to-muted bg-linear-to-r from-white shadow-none rtl:bg-linear-to-l"
				>
					<CardContent className="flex items-center gap-4">
						<div className="grow cursor-default overflow-hidden">
							<div className="truncate text-sm">{category.title}</div>
						</div>

						{hasActions && (
							<IconButtonGroup className="w-fit shrink-0">
								{canEdit && (
									<IconButton
										disabled={isLoading}
										tooltip={t("category-list.item.actions.edit")}
										onClick={openUpsertDialog.bind(null, category)}
									>
										<LucidePenSquare />
									</IconButton>
								)}

								{canDelete && (
									<IconButton
										disabled={isLoading}
										tooltip={t("category-list.item.actions.delete")}
										onClick={openDeleteDialog.bind(null, category)}
									>
										<LucideTrash />
									</IconButton>
								)}
							</IconButtonGroup>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export { CategoryListGrid };
