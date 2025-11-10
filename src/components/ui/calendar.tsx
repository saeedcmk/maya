import "react-day-picker/style.css";
import {
	DayPicker as GregorianDayPicker,
	NextMonthButton,
	PreviousMonthButton,
} from "react-day-picker";
import { DayPicker as JalaliDayPicker } from "react-day-picker/jalali";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type CalendarProps = React.ComponentProps<typeof GregorianDayPicker>;
type JalaliCalendarProps = React.ComponentProps<typeof JalaliDayPicker>;

const calendarStyle = {
	"--rdp-accent-color": "var(--primary)",
	"--rdp-day-width": "2.5rem",
	"--rdp-day-height": "2.5rem",
} as React.CSSProperties;

const calendarClassNames = ({
	mode,
	classNames,
}: {
	mode: CalendarProps["mode"];
	classNames: CalendarProps["classNames"];
}): CalendarProps["classNames"] => ({
	caption_label:
		"flex cursor-default text-xsm items-center justify-center font-normal px-3",
	// weekdays: "flex space-x-1",
	weekday: "rdp-weekday text-muted-foreground font-normal! text-xsm!",
	// week: "flex w-full space-x-1",
	// weeks: "space-y-2",
	day: cn(
		"rdp-day hover:bg-opacity-10 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 relative rounded-lg p-0 text-center transition-[background] focus-within:relative focus-within:z-20 focus-within:not-aria-selected:bg-neutral-600/10 hover:not-aria-selected:not-data-disabled:bg-neutral-600/10 [&:has([aria-selected].day-range-end)]:rounded-e-lg",
		mode === "range"
			? "[&:has(>.day-range-end)]:rounded-e-lg [&:has(>.day-range-start)]:rounded-s-lg first:[&:has([aria-selected])]:rounded-s-lg last:[&:has([aria-selected])]:rounded-e-lg"
			: "[&:has([aria-selected])]:rounded-lg"
	),
	day_button:
		"rdp-day_button size-full! p-0 font-normal text-inherit aria-selected:opacity-100 border-0! outline-none!",
	selected:
		"rdp-selected bg-primary text-primary-foreground! hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground text-xsm! focus-within:bg-primary/90",
	today: "rdp-today bg-accent text-accent-foreground",
	// outside:
	// 	"day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
	// disabled: "text-muted-foreground opacity-50",
	// range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
	// hidden: "invisible",
	...classNames,
});

const calendarComponents = (): CalendarProps["components"] => ({
	PreviousMonthButton: ({ className, ...props }) => (
		<PreviousMonthButton
			className={cn(
				buttonVariants({ variant: "outline" }),
				"absolute start-1 h-7 w-7 bg-transparent p-0! opacity-70 hover:opacity-100",
				className
			)}
			{...props}
		/>
	),

	NextMonthButton: ({ className, ...props }) => (
		<NextMonthButton
			className={cn(
				buttonVariants({ variant: "outline" }),
				"absolute end-1 h-7 w-7 bg-transparent p-0! opacity-70 hover:opacity-100",
				className
			)}
			{...props}
		/>
	),
});

function GregorianCalendar({
	animate = true,
	className,
	classNames,
	style,
	...props
}: CalendarProps) {
	return (
		<GregorianDayPicker
			animate={animate}
			className={cn("p-4", className)}
			classNames={calendarClassNames({ classNames, mode: props.mode })}
			components={calendarComponents()}
			style={{ ...calendarStyle, ...style }}
			{...props}
		/>
	);
}

function JalaliCalendar({
	animate = true,
	className,
	classNames,
	style,
	...props
}: JalaliCalendarProps) {
	return (
		<JalaliDayPicker
			animate={animate}
			className={cn("p-4", className)}
			classNames={calendarClassNames({ classNames, mode: props.mode })}
			components={calendarComponents()}
			numerals="latn"
			style={{ ...calendarStyle, ...style }}
			{...props}
		/>
	);
}

export type { CalendarProps, JalaliCalendarProps };
export { GregorianCalendar, JalaliCalendar };
