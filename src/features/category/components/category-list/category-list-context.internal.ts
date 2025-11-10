"use client";

import { createContext } from "react";
import { useContextCreator } from "@/lib/hooks/use-context-creator";
import type { EntityListContextType } from "@/lib/utils/types";
import type { Category } from "../../types/category";

type CategoryListContextType = EntityListContextType<Category> & {
	openUpsertDialog: (category?: Category) => Promise<void>;
	openDeleteDialog: (category: Category) => Promise<void>;
};

const CategoryListContext = createContext<CategoryListContextType | null>(null);

function useCategoryListContext(): CategoryListContextType {
	return useContextCreator(CategoryListContext);
}

export type { CategoryListContextType };
export { CategoryListContext, useCategoryListContext };
