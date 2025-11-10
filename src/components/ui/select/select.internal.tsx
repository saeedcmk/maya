"use client";

import { FieldBaseProps } from "../form/form.types";
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValue,
} from "./select.primitives";
import { SelectOption } from "./select.types";

type SelectProps<T extends string | number = string> =
	React.ComponentPropsWithoutRef<typeof SelectTrigger> &
		FieldBaseProps<T> & {
			options: SelectOption<T>[] | undefined;
		};

function Select<T extends string | number = string>({
	ref,
	defaultValue,
	disabled,
	id,
	options,
	value,
	onBlur,
	onChange,
	...props
}: SelectProps<T>) {
	return (
		<div onBlur={onBlur}>
			<SelectRoot
				defaultValue={defaultValue?.toString()}
				disabled={disabled}
				value={value?.toString()}
				onValueChange={onChange}
			>
				<SelectTrigger ref={ref} id={id} {...props}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options?.map((item, index) => {
						const isGroup = "options" in item;

						return isGroup ? (
							<SelectGroup key={`${index}-${item.label}`}>
								<SelectLabel>{item.label}</SelectLabel>
								{item.options.map((option, index) => (
									<SelectItem
										key={`${index}-${option.value}`}
										value={option.value.toString()}
									>
										{option.label ?? option.value}
									</SelectItem>
								))}
							</SelectGroup>
						) : (
							<SelectItem
								key={`${index}-${item.value}`}
								value={item.value.toString()}
							>
								{item.label}
							</SelectItem>
						);
					})}
				</SelectContent>
			</SelectRoot>
		</div>
	);
}

export type { SelectProps };
export { Select };
