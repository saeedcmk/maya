import { findManyCategory } from "./find-many-category";

async function countCategoryExpenses(
	categoryId: string,
	spaceId: string
): Promise<number> {
	const data = await findManyCategory(spaceId, {
		where: { id: categoryId },
		select: {
			_count: { select: { expenses: true } },
		},
	}).then((response) => response[0]._count.expenses);

	return data;
}

export { countCategoryExpenses };
