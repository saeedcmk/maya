"use client";

import { LucideX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { getObjectEntries } from "@/lib/utils/object";
import type { FilterBarConfig } from "./filter-bar.types";

type FilterBarProps<T extends Record<string, any>> = {
	disabled?: boolean;
	filterArgs: Partial<T>;
	setFilterArgs: (filterArgs: Partial<T>) => void;
	config: FilterBarConfig<T>;
};

function FilterBar<T extends Record<string, any>>(props: FilterBarProps<T>) {
	const { filterArgs, config } = props;

	const activeFilters = useMemo(() => {
		return getObjectEntries(filterArgs).filter(
			([, value]) =>
				typeof value !== "undefined" &&
				value !== null &&
				!(typeof value === "string" && value.trim() === "") &&
				!(Array.isArray(value) && (value as any[]).length === 0)
		);
	}, [filterArgs]);

	const count = useMemo(() => {
		return activeFilters
			.map(([filterKey, filterValue]) => {
				const filterConfig = config[filterKey];

				if (typeof filterConfig.count !== "undefined") {
					return filterConfig.count(filterValue!);
				}

				return 1;
			})
			.reduce((sum, curr) => (sum += curr), 0);
	}, [config, activeFilters]);

	if (count === 0) return null;

	return (
		<FilterBarContent activeFilters={activeFilters} count={count} {...props} />
	);
}

function FilterBarContent<T extends Record<string, any>>({
	disabled,
	filterArgs,
	setFilterArgs,
	config,
	activeFilters,
	count,
}: FilterBarProps<T> & {
	activeFilters: [keyof T, Partial<T>[keyof T]][];
	count: number;
}) {
	const t = useTranslations();

	function handleRemove(key: keyof T) {
		return () => {
			if (disabled) return;
			setFilterArgs({ ...filterArgs, [key]: undefined });
		};
	}

	function handleClearAll() {
		if (disabled) return;
		setFilterArgs({});
	}

	return (
		<CardContent>
			<div className="xs:flex-row flex flex-col gap-1.5">
				<div>{t("filter-bar.title")}:</div>

				<div className="flex flex-wrap gap-3 pt-0.5">
					{activeFilters.map(([key, value]) => {
						const filterConfig = config[key];

						if (!filterConfig) return null;

						return (
							<FilterBarItem key={String(key)} onRemove={handleRemove(key)}>
								{filterConfig.title && (
									<span>
										{typeof filterConfig.title === "string"
											? filterConfig.title
											: filterConfig.title(t)}
										:
									</span>
								)}

								<div>
									{typeof filterConfig.render !== "undefined"
										? typeof filterConfig.render === "string"
											? filterConfig.render
											: filterConfig.render(value!, { t })
										: value}
								</div>
							</FilterBarItem>
						);
					})}

					{count > 1 && (
						<Badge
							className="cursor-pointer"
							color="red"
							onClick={handleClearAll}
						>
							{t("filter-bar.clear_all")}
						</Badge>
					)}
				</div>
			</div>
		</CardContent>
	);
}

function FilterBarItem({
	children,
	onRemove,
}: React.PropsWithChildren<{ onRemove: () => void }>) {
	return (
		<Badge color="darkGray">
			<div className="flex items-center gap-1">{children}</div>
			<LucideX className="cursor-pointer" onClick={onRemove} />
		</Badge>
	);
}

export { FilterBar };
