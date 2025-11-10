"use client";

import { LucideCalendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDateUtils } from "@/lib/i18n/hooks/use-date-utils";
import { useLanguage } from "@/lib/i18n/hooks/use-language";
import { cn } from "@/lib/utils/cn";
import {
	CalendarProps,
	GregorianCalendar,
	JalaliCalendar,
	JalaliCalendarProps,
} from "../calendar";
import { type ControlledFieldProps } from "../form/form.types";
import { Popover, PopoverAnchor, PopoverContent } from "../popover";
import { Input } from "./input.internal";

type BaseDateInputProps<T> = Pick<DateInputProps<T>, "value" | "onChange"> &
	Omit<T, "mode" | "month" | "onMonthChange" | "selected" | "onSelect"> & {
		closeOnSelect?: boolean;
		closeCalendar: () => void;
	};

type GregorianDateInputProps = BaseDateInputProps<CalendarProps>;

function GregorianDateInput(props: GregorianDateInputProps) {
	const { closeOnSelect, value, closeCalendar, onChange, ...calendarProps } =
		props;

	const { formatLocaleDate } = useDateUtils();

	const [selected, setSelected] = useState<Date | undefined>(() => {
		const [y, m, d] = value?.split("-").map(Number);
		if (!y || !m || !d) return;
		return new Date(y, m - 1, d);
	});

	useEffect(() => {
		const [y, m, d] = value?.split("-").map(Number);
		if (!y || !m || !d) {
			setSelected(undefined);
		} else {
			setSelected(new Date(y, m - 1, d));
		}
	}, [value]);

	const [currentMonth, setCurrentMonth] = useState<Date | undefined>(
		selected ?? new Date()
	);

	useEffect(() => {
		setCurrentMonth(selected);
	}, [selected]);

	return (
		<GregorianCalendar
			{...calendarProps}
			mode="single"
			month={currentMonth}
			onMonthChange={setCurrentMonth}
			selected={selected}
			onSelect={(selected: any) => {
				if (selected && closeOnSelect) {
					closeCalendar();
				}

				onChange(selected ? formatLocaleDate(selected) : "");
			}}
		/>
	);
}

type JalaliDateInputProps = BaseDateInputProps<JalaliCalendarProps>;

function JalaliDateInput(props: JalaliDateInputProps) {
	const { closeOnSelect, value, closeCalendar, onChange, ...calendarProps } =
		props;

	const { newDate, formatLocaleDate } = useDateUtils();

	const [selected, setSelected] = useState<Date | undefined>(() => {
		const [y, m, d] = value?.split("/").map(Number);
		if (!y || !m || !d) return;
		return newDate({ year: y, monthIndex: m - 1, date: d });
	});

	useEffect(() => {
		const [y, m, d] = value?.split("/").map(Number);
		if (!y || !m || !d) {
			setSelected(undefined);
		} else {
			setSelected(newDate({ year: y, monthIndex: m - 1, date: d }));
		}
	}, [value, newDate]);

	const [currentMonth, setCurrentMonth] = useState<Date | undefined>(
		selected ?? new Date()
	);

	useEffect(() => {
		setCurrentMonth(selected);
	}, [selected]);

	return (
		<JalaliCalendar
			{...calendarProps}
			mode="single"
			month={currentMonth}
			onMonthChange={setCurrentMonth}
			selected={selected}
			onSelect={(selected) => {
				if (selected && closeOnSelect) {
					closeCalendar();
				}

				onChange(selected ? formatLocaleDate(selected) : "");
			}}
		/>
	);
}

type DateInputProps<T> = React.ComponentPropsWithoutRef<typeof Input> &
	ControlledFieldProps & {
		calendar?: Omit<
			T,
			"mode" | "month" | "onMonthChange" | "selected" | "onSelect"
		> & {
			closeOnSelect?: boolean;
		};
	};

function DateInput<T extends JalaliCalendarProps>(props: DateInputProps<T>) {
	const { ref, calendar, id, value, onBlur, onChange, ...propsRest } = props;

	const { calendar: calendarType } = useLanguage();

	const DateInput =
		calendarType === "jalali" ? JalaliDateInput : GregorianDateInput;

	const inputRef = useRef<HTMLInputElement>(null);

	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div onBlur={onBlur}>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverAnchor className="relative">
					<Input
						ref={(event) => {
							inputRef.current = event;
							ref?.(event);
						}}
						{...propsRest}
						id={id}
						value={value}
						onChange={onChange}
						onFocus={() => {
							inputRef.current?.select();
						}}
						onKeyDown={(event) => {
							if (event.key === " " || event.key === "Enter") {
								setIsOpen(true);
							}
						}}
					/>
					<button
						className={cn(
							"text-muted-foreground absolute end-0 top-0 flex size-9 cursor-pointer items-center justify-center opacity-50",
							props["aria-invalid"] && "text-destructive"
						)}
						type="button"
						onClick={() => {
							setIsOpen(true);
						}}
					>
						<LucideCalendar className="size-4" />
					</button>
				</PopoverAnchor>
				<PopoverContent
					className="w-auto p-0"
					align="start"
					onCloseAutoFocus={(event) => {
						inputRef.current?.focus();
						event.preventDefault();
					}}
				>
					<DateInput
						value={value}
						onChange={onChange}
						closeCalendar={setIsOpen.bind(null, false)}
						{...calendar}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export { DateInput, GregorianDateInput, JalaliDateInput };
