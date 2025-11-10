"use client";

import { useLanguage } from "@/lib/i18n/hooks/use-language";

type DateOnlyProps = React.ComponentProps<"span"> & {
	date: Date | string | undefined;
};

function DateOnly({ date: d, ...props }: DateOnlyProps) {
	const { intl } = useLanguage();

	if (!d) return;

	const seperator = intl.startsWith("fa") ? "،" : ",";

	const weekdayFormat = new Intl.DateTimeFormat(intl, {
		weekday: "long",
	});

	const dateFormat = new Intl.DateTimeFormat(intl, {
		dateStyle: "long",
	});

	const date = typeof d === "string" ? new Date(d) : d;

	const formattedWeekday = weekdayFormat.format(date);
	const formattedDate = dateFormat.format(date);

	return (
		<span {...props}>{`${formattedWeekday}${seperator} ${formattedDate}`}</span>
	);
}

export { DateOnly };
