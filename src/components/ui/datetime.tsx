"use client";

import { useLanguage } from "@/lib/i18n/hooks/use-language";
import { cn } from "@/lib/utils/cn";

type DateTimeProps = React.ComponentProps<"div"> & {
	date: Date | string;
};

function DateTime({ className, date: d, ...props }: DateTimeProps) {
	const { intl } = useLanguage();

	const seperator = intl.startsWith("fa") ? "،" : ",";

	const timeFormat = new Intl.DateTimeFormat(intl, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	const weekdayFormat = new Intl.DateTimeFormat(intl, {
		weekday: "long",
	});

	const dateFormat = new Intl.DateTimeFormat(intl, {
		dateStyle: "long",
	});

	const date = typeof d === "string" ? new Date(d) : d;

	const formattedTime = timeFormat.format(date);
	const formattedWeekday = weekdayFormat.format(date);
	const formattedDate = dateFormat.format(date);

	return (
		<div className={cn("space-y-2", className)} {...props}>
			<div>{formattedTime}</div>
			<div>{`${formattedWeekday}${seperator} ${formattedDate}`}</div>
		</div>
	);
}

export { DateTime };
