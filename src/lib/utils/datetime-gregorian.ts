import {
	endOfMonth,
	format,
	getDate,
	getMonth,
	getYear,
	parse,
	startOfMonth,
} from "date-fns";

function newGregorianDate(
	input: Partial<{
		year: number;
		monthIndex: number;
		date: number;
	}>
): Date {
	const current = new Date();

	const {
		year = getYear(current),
		monthIndex = getMonth(current),
		date = getDate(current),
	} = input;

	return new Date(year, monthIndex, date);
}

function getGregorianMonth(date?: Date | string | number | undefined): number {
	return getMonth(date ?? new Date());
}

function getGregorianYear(date?: Date | string | number | undefined): number {
	return getYear(date ?? new Date());
}

function getGregorianMonthName(monthIndex: number): string;
function getGregorianMonthName(date: Date | string | number): string;
function getGregorianMonthName(input: Date | string | number): string {
	let date: Date | string | number;

	if (typeof input === "number" && input < 12) {
		date = newGregorianDate({ monthIndex: input });
	} else {
		date = input;
	}

	return format(date, "LLLL");
}

function getStartOfGregorianMonth(date: Date | string | number): Date {
	return startOfMonth(date);
}

function getEndOfGregorianMonth(date: Date | string | number): Date {
	return endOfMonth(date);
}

function formatGregorianDate(
	date: Date | string,
	f: string = "yyyy-MM-dd"
): string {
	return format(date instanceof Date ? date : new Date(date), f);
}

function parseGregorian(input: string, format: string = "yyyy-MM-dd"): Date {
	return parse(input, format, newGregorianDate({}));
}

export {
	formatGregorianDate,
	getEndOfGregorianMonth,
	getGregorianMonth,
	getGregorianMonthName,
	getGregorianYear,
	getStartOfGregorianMonth,
	newGregorianDate,
	parseGregorian,
};
