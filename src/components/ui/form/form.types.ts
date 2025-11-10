import { Noop, RefCallBack, WithRequired } from "@/lib/utils/types";

type FieldBaseProps<TValue = any> = Partial<{
	ref: RefCallBack;
	defaultValue: TValue;
	disabled: boolean;
	id: string;
	name: string;
	value: TValue;
	onBlur: Noop;
	onChange: (...event: any[]) => void;
}>;

type ControlledFieldProps<TValue = any> = WithRequired<
	Omit<FieldBaseProps<TValue>, "defaultValue">,
	"value" | "onChange"
>;

type UncontrolledFieldProps<TValue = any> = WithRequired<
	Omit<FieldBaseProps<TValue>, "value" | "onChange">,
	"defaultValue" | "name"
>;

export type { ControlledFieldProps, FieldBaseProps, UncontrolledFieldProps };
