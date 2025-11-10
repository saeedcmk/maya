import { UTCDate } from "@date-fns/utc";
import { differenceInDays, format, subMonths } from "date-fns";

function asUTC(date: Date): Date {
	const YYYY = date.getFullYear();
	const MM = (date.getMonth() + 1).toString().padStart(2, "0");
	const DD = date.getDate().toString().padStart(2, "0");
	const hh = date.getHours().toString().padStart(2, "0");
	const mm = date.getMinutes().toString().padStart(2, "0");
	const ss = date.getSeconds().toString().padStart(2, "0");

	return new Date(`${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}.000Z`);
}

function formatGregorianDateInUTC(
	input: Date,
	f: string = "yyyy-MM-dd"
): string {
	return format(
		new UTCDate(input.getFullYear(), input.getMonth(), input.getDate()),
		f
	);
}

function getDifferenceInDays(
	laterDate: Date | string | number,
	earlierDate: Date | string | number
): number {
	return differenceInDays(laterDate, earlierDate);
}

function parseDuration(str: string): number {
	const match = str.match(/^(\d+)([smhd])$/);
	if (!match) throw new Error("Invalid duration format");

	const value = parseInt(match[1], 10);
	const unit = match[2];

	switch (unit) {
		case "s":
			return value;
		case "m":
			return value * 60;
		case "h":
			return value * 60 * 60;
		case "d":
			return value * 60 * 60 * 24;
		default:
			throw new Error("Unknown duration unit");
	}
}

function subtractMonths(date: Date, amount: number): Date {
	return subMonths(date, amount);
}

export {
	asUTC,
	formatGregorianDateInUTC,
	getDifferenceInDays,
	parseDuration,
	subtractMonths,
};
