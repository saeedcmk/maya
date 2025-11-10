type CategoryUpdateInput = { spaceId: string } & Partial<{
	title: string;
	slug: string;
}>;

export type { CategoryUpdateInput };
