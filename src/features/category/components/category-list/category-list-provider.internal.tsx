"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useMessages } from "next-intl";
import { useCallback, useMemo } from "react";
import { useDialogs } from "@/components/app/dialog/use-dialogs";
import { useSpaceContext } from "@/features/space/hooks/use-space-context";
import type { CategoryFindManyArgs } from "../../models/category-find-many";
import { findManyCategory } from "../../services/find-many-category";
import type { Category } from "../../types/category";
import {
	CategoryListContext,
	type CategoryListContextType,
} from "./category-list-context.internal";

const CategoryUpsertDialog = dynamic(() => import("../category-upsert"));

const CategoryDeleteDialog = dynamic(() => import("../category-delete"));

function CategoryListProvider(props: React.PropsWithChildren) {
	const dialogs = useDialogs();

	const messages = useMessages();

	const { space } = useSpaceContext();

	const queryArgs = {
		include: { user: true },
		orderBy: { title: "asc" },
	} satisfies CategoryFindManyArgs;

	const {
		data: categories,
		isFetching,
		error,
	} = useQuery({
		queryKey: ["spaces", space.id, "categories", queryArgs],
		queryFn: async () => await findManyCategory(space.id, queryArgs),
	});

	const openUpsertDialog = useCallback(
		async (category?: Category) => {
			await dialogs.open(
				CategoryUpsertDialog,
				{ space, category },
				{ messages }
			);
		},
		[dialogs, messages, space]
	);

	const openDeleteDialog = useCallback(
		async (category: Category) => {
			await dialogs.open(CategoryDeleteDialog, { category }, { messages });
		},
		[dialogs, messages]
	);

	const contextValue = useMemo<CategoryListContextType>(
		() => ({
			isLoading: isFetching,
			error,
			items: categories,

			openUpsertDialog,
			openDeleteDialog,
		}),
		[isFetching, error, categories, openUpsertDialog, openDeleteDialog]
	);

	return <CategoryListContext value={contextValue} {...props} />;
}

export { CategoryListProvider };
