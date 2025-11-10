"use client";

import { useMemo } from "react";
import {
	asUTC,
	formatGregorianDateInUTC,
	getDifferenceInDays,
	parseDuration,
	subtractMonths,
} from "@/lib/utils/datetime";
import {
	formatGregorianDate,
	getEndOfGregorianMonth,
	getGregorianMonth,
	getGregorianMonthName,
	getGregorianYear,
	getStartOfGregorianMonth,
	newGregorianDate,
	parseGregorian,
} from "@/lib/utils/datetime-gregorian";
import {
	formatJalaliDate,
	getEndOfJalaliMonth,
	getJalaliMonth,
	getJalaliMonthName,
	getJalaliYear,
	getStartOfJalaliMonth,
	newJalaliDate,
	parseJalali,
} from "@/lib/utils/datetime-jalali";
import { DateContext, DateContextType } from "../contexts/date-context";
import { useLanguage } from "../hooks/use-language";

function DateProvider(props: React.PropsWithChildren) {
	const { calendar } = useLanguage();

	const contextValue = useMemo(
		() =>
			({
				...(calendar === "jalali"
					? {
							newDate: newJalaliDate,
							getMonth: getJalaliMonth,
							getYear: getJalaliYear,
							getMonthName: getJalaliMonthName,
							getStartOfMonth: getStartOfJalaliMonth,
							getEndOfMonth: getEndOfJalaliMonth,
							formatLocaleDate: formatJalaliDate,
							parseLocaleDate: parseJalali,
						}
					: {
							newDate: newGregorianDate,
							getMonth: getGregorianMonth,
							getYear: getGregorianYear,
							getMonthName: getGregorianMonthName,
							getStartOfMonth: getStartOfGregorianMonth,
							getEndOfMonth: getEndOfGregorianMonth,
							formatLocaleDate: formatGregorianDate,
							parseLocaleDate: parseGregorian,
						}),
				asUTC,
				formatGregorianDateInUTC,
				getDifferenceInDays,
				parseDuration,
				subtractMonths,
			}) satisfies DateContextType,
		[calendar]
	);

	return <DateContext.Provider value={contextValue} {...props} />;
}

export { DateProvider };
