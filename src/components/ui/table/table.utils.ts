import type { TableColumn } from "./table.types";

function tableRowNumberColumn<
	TType extends object,
	TContext extends object = object,
>(
	col?: Pick<TableColumn<TType, TContext>, "width">
): TableColumn<TType, TContext> {
	const { width } = col ?? {};

	return {
		key: "#",
		title: "#",
		render: (_, { index, offset }) => index + offset + 1,
		width: width ?? 64,
	};
}

export { tableRowNumberColumn };
