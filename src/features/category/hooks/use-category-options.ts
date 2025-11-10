"use client";

import type { Prisma } from "@prisma/client";
import {
	keepPreviousData,
	useQuery,
	UseQueryResult,
} from "@tanstack/react-query";
import type { SelectOptionItem } from "@/components/ui/select/select.types";
import { toSelectOptions } from "@/components/ui/select/select.utils";
import type { CategoryFindManyArgs } from "../models/category-find-many";
import { findManyCategory } from "../services/find-many-category";

function useCategoryOptions(
	spaceId: string,
	args: Partial<{ where: Omit<Prisma.CategoryWhereInput, "spaceId"> }> = {}
): UseQueryResult<SelectOptionItem[], Error> {
	const queryArgs = {
		where: args.where,
		select: { id: true, title: true },
		orderBy: { title: "desc" },
	} satisfies CategoryFindManyArgs;

	const data = useQuery({
		queryKey: ["spaces", spaceId, "categories", queryArgs],
		queryFn: async () =>
			await findManyCategory(spaceId, queryArgs).then((data) =>
				toSelectOptions(data, {
					item: { value: (x) => x.id, label: (x) => x.title },
				})
			),
		placeholderData: keepPreviousData,
		staleTime: 60 * 60 * 1000, // 1h
	});

	return data;
}

export { useCategoryOptions };
