"use client";

import { LucideCheck, LucideChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandNoInput,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDateUtils } from "@/lib/i18n/hooks/use-date-utils";
import { cn } from "@/lib/utils/cn";
import { useExpenseListContext } from "./expense-list-context.internal";

const MONTHS_TO_LOAD = 6;

function useDate() {
	const {
		getMonth,
		getYear,
		formatLocaleDate,
		parseLocaleDate,
		subtractMonths,
	} = useDateUtils();

	const generateMonths = useCallback(
		(startDate: Date, count: number): string[] => {
			const months = [];
			for (let i = 0; i < count; i++) {
				const date = subtractMonths(startDate, i);
				months.push(formatLocaleDate(date, "MMMM yyyy"));
			}
			return months;
		},
		[formatLocaleDate, subtractMonths]
	);

	const toMonthAndYear = useCallback(
		(month: string) => {
			const date = parseLocaleDate(month, "MMMM yyyy");
			return { year: getYear(date), month: getMonth(date) };
		},
		[getMonth, getYear, parseLocaleDate]
	);

	return { generateMonths, toMonthAndYear };
}

function ExpenseListWidgetMonthSelect() {
	const t = useTranslations();

	const { generateMonths, toMonthAndYear } = useDate();

	const { changePeriod } = useExpenseListContext();

	const [loadedMonthsCount, setLoadedMonthsCount] = useState(MONTHS_TO_LOAD);
	const [months, setMonths] = useState(() =>
		generateMonths(new Date(), MONTHS_TO_LOAD)
	);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(months[0]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const selectedItemRef = useRef<HTMLDivElement>(null);

	function loadMore() {
		const newCount = loadedMonthsCount + MONTHS_TO_LOAD;
		setLoadedMonthsCount(newCount);
		setMonths(generateMonths(new Date(), newCount));
	}

	function selectMonth(month: string) {
		setSelectedMonth(month);
		setIsOpen(false);

		changePeriod(toMonthAndYear(month));
	}

	useEffect(() => {
		if (isOpen) {
			const timeoutId = setTimeout(() => {
				if (selectedItemRef.current) {
					selectedItemRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}
			}, 0);

			return () => clearTimeout(timeoutId);
		}
	}, [isOpen]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button className="w-36 justify-between" color="gray" variant="outline">
					<span>{selectedMonth}</span>
					<LucideChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-36">
				<Command>
					<CommandList>
						<CommandNoInput />

						<CommandGroup>
							{months.map((month) => {
								const isSelected = month === selectedMonth;

								return (
									<CommandItem
										key={month}
										ref={isSelected ? selectedItemRef : null}
										className={cn(
											"cursor-pointer justify-between",
											isSelected &&
												"data-[selected=true]:bg-secondary bg-secondary data-[selected=true]:text-secondary-foreground text-secondary-foreground cursor-default"
										)}
										onSelect={() => selectMonth(month)}
									>
										<span className="grow truncate">{month}</span>
										{isSelected && (
											<LucideCheck className="data-[selected=true]:text-secondary-foreground size-4" />
										)}
									</CommandItem>
								);
							})}

							<CommandSeparator className="my-1" />

							<CommandItem
								className="cursor-pointer justify-center"
								onSelect={() => loadMore()}
							>
								{t("expense-list.month-select.actions.more")}
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export { ExpenseListWidgetMonthSelect };
