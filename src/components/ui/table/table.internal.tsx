"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "../skeleton";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRoot,
	TableRow,
} from "./table.primitives";
import { TableColumn } from "./table.types";

type TableProps<
	TType extends Record<string, any>,
	TContext extends object = object,
> = {
	columns: TableColumn<TType, TContext>[];
	items?: TType[] | null | undefined;
	loading?: boolean;
	offset?: number;
	rowCount?: number;
	rowKey?: keyof TType | ((item: TType) => string);
	rowContext?: (
		item: TType,
		args: {
			index: number;
			offset: number;
		}
	) => TContext;
	slotProps?: Partial<{
		table: React.ComponentPropsWithoutRef<typeof TableRoot>;
		head: React.ComponentPropsWithoutRef<typeof TableHeader>;
		body: React.ComponentPropsWithoutRef<typeof TableBody>;
	}>;
};

function Table<
	TType extends Record<string, any>,
	TContext extends object = object,
>({
	columns,
	items,
	loading = false,
	offset = 0,
	rowCount,
	rowKey,
	rowContext,
	slotProps,
}: TableProps<TType, TContext>) {
	const t = useTranslations();

	const {
		table: tableProps,
		head: headProps,
		body: bodyProps,
	} = slotProps ?? {};

	const normalizedRowCount = rowCount && rowCount !== -1 ? rowCount : undefined;

	return (
		<TableRoot {...tableProps}>
			<colgroup>
				{columns.map(
					(col) =>
						(typeof col.if === "undefined" || col.if) && (
							<col key={col.key.toString()} width={col.width} />
						)
				)}
			</colgroup>

			<TableHeader {...headProps}>
				<TableRow className="whitespace-nowrap">
					{columns.map(
						(col) =>
							(typeof col.if === "undefined" || col.if) && (
								<TableHead key={col.key.toString()}>
									{typeof col.title === "function" ? col.title(t) : col.title}
								</TableHead>
							)
					)}
				</TableRow>
			</TableHeader>

			<TableBody {...bodyProps}>
				{loading || !items ? (
					<TableSkeletonRows
						cols={columns
							.filter((col) => typeof col.if === "undefined" || col.if)
							.map((col) => col.skeleton)}
						rows={normalizedRowCount}
					/>
				) : items.length !== 0 ? (
					items.map((item, index) => (
						<TableRow
							key={
								rowKey
									? typeof rowKey === "function"
										? rowKey(item)
										: String(item[rowKey])
									: undefined
							}
							className="whitespace-nowrap"
						>
							{columns.map(
								(col) =>
									(typeof col.if === "undefined" || col.if) && (
										<TableCell
											key={col.key.toString()}
											className={col.className}
										>
											{(col.render
												? typeof col.render === "string"
													? col.render in item
														? item[col.render]
														: col.render
													: col.render(item, {
															t,
															isLoading: loading,
															context:
																rowContext?.(item, {
																	index,
																	offset,
																}) ?? ({} as TContext),
															index,
															offset,
														})
												: col.key in item && item[col.key]) || col.defaultValue}
										</TableCell>
									)
							)}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell
							colSpan={
								columns.filter((col) => typeof col.if === "undefined" || col.if)
									.length
							}
						>
							<span className="text-muted-foreground">{t("exprs.empty")}</span>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</TableRoot>
	);
}

function TableSkeletonRows({
	rows = 1,
	cols,
}: {
	rows?: number;
	cols: (
		| number
		| (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)[]
		| undefined
	)[];
}) {
	return Array.from({ length: rows }, (_, index) => index + 1).map((row) => (
		<TableRow key={`skeleton-row-${row}`}>
			{cols.map((col, i) => {
				const widths = Array.isArray(col)
					? col
					: typeof col === "number"
						? Array.from({ length: col }, (_, index) => index + 1).map(() => 12)
						: [12];

				return (
					<TableCell key={`skeleton-col-${col}-${i}`}>
						<div className="space-y-2">
							{widths.map((w, j) => (
								<Skeleton
									key={`skeleton-col-${col}-${i}-${j}`}
									className={cn(
										"h-3",
										w === 1
											? "w-1/12"
											: w === 2
												? "w-1/6"
												: w === 3
													? "w-1/3"
													: w === 4
														? "w-1/4"
														: w === 6
															? "w-1/2"
															: w === 9
																? "w-9/12"
																: w === 12 && "w-full"
									)}
								/>
							))}
						</div>
					</TableCell>
				);
			})}
		</TableRow>
	));
}

export type { TableProps };
export { Table };
