import {
	endOfMonth,
	format,
	getDate,
	getMonth,
	getYear,
	newDate,
	parse,
	startOfMonth,
} from "date-fns-jalali";

function newJalaliDate(
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

	return newDate(year, monthIndex, date);
}

function getJalaliMonth(date?: Date | string | number | undefined): number {
	return getMonth(date ?? new Date());
}

function getJalaliYear(date?: Date | string | number | undefined): number {
	return getYear(date ?? new Date());
}

function getJalaliMonthName(monthIndex: number): string;
function getJalaliMonthName(date: Date | string | number): string;
function getJalaliMonthName(input: Date | string | number): string {
	let date: Date | string | number;

	if (typeof input === "number" && input < 12) {
		date = newJalaliDate({ monthIndex: input });
	} else {
		date = input;
	}

	return format(date, "LLLL");
}

function getStartOfJalaliMonth(date: Date | string | number): Date {
	return startOfMonth(date);
}

function getEndOfJalaliMonth(date: Date | string | number): Date {
	return endOfMonth(date);
}

function formatJalaliDate(
	date: Date | string,
	f: string = "yyyy/MM/dd"
): string {
	return format(date instanceof Date ? date : new Date(date), f);
}

function parseJalali(input: string, format: string = "yyyy/MM/dd"): Date {
	return parse(input, format, newJalaliDate({}));
}

export {
	formatJalaliDate,
	getEndOfJalaliMonth,
	getJalaliMonth,
	getJalaliMonthName,
	getJalaliYear,
	getStartOfJalaliMonth,
	newJalaliDate,
	parseJalali,
};
