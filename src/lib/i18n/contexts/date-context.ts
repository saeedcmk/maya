"use client";

import { createContext } from "react";

type DateContextType = {
	newDate: (
		input: Partial<{
			year: number;
			monthIndex: number;
			date: number;
		}>
	) => Date;

	getMonth: (date?: Date | string | number | undefined) => number;
	getYear: (date?: Date | string | number | undefined) => number;

	getMonthName: {
		(monthIndex: number): string;
		(date: Date | string | number): string;
	};
	getStartOfMonth: (date: Date | string | number) => Date;
	getEndOfMonth: (date: Date | string | number) => Date;

	formatLocaleDate: (input: Date | string, format?: string) => string;
	parseLocaleDate: (input: string, format?: string) => Date;

	asUTC: (date: Date) => Date;
	formatGregorianDateInUTC: (input: Date, format?: string) => string;
	getDifferenceInDays: (
		laterDate: Date | string | number,
		earlierDate: Date | string | number
	) => number;
	parseDuration: (str: string) => number;
	subtractMonths: (date: Date, amount: number) => Date;
};

const DateContext = createContext<DateContextType | null>(null);

export type { DateContextType };
export { DateContext };
