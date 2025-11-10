"use client";

import { type IMaskInputProps, IMaskMixin } from "react-imask";
import { type FieldBaseProps } from "../form/form.types";
import { Input } from "./input.internal";

type MaskInputProps = IMaskInputProps<HTMLInputElement> &
	FieldBaseProps<string>;

const IMaskInput = IMaskMixin<HTMLInputElement>(({ inputRef, ...props }) => {
	return <Input {...props} ref={inputRef} />;
});

function MaskInput({ ref, onChange, ...props }: MaskInputProps) {
	return (
		<IMaskInput
			{...props}
			inputRef={ref}
			unmask
			onAccept={(value: string) => {
				onChange?.(value);
			}}
		/>
	);
}

export { MaskInput };
