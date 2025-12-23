"use client";

import { useLanguage } from "@/lib/i18n/hooks/use-language";
import { cn } from "@/lib/utils/cn";

type DateTimeProps = React.ComponentProps<"div"> & {
	date: Date | string;
	render?: (args: {
		time: string;
		date: string;
		separator: string;
	}) => React.ReactElement;
};

function DateTime({ className, date: d, render, ...props }: DateTimeProps) {
	const { intl } = useLanguage();

	const separator = intl.startsWith("fa") ? "،" : ",";

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

	if (render) {
		return render({
			time: formattedTime,
			date: `${formattedWeekday}${separator} ${formattedDate}`,
			separator,
		});
	}

	return (
		<div className={cn("space-y-1", className)} {...props}>
			<div>{formattedTime}</div>
			<div>{`${formattedWeekday}${separator} ${formattedDate}`}</div>
		</div>
	);
}

export { DateTime };
