import { type FieldBaseProps } from "../form/form.types";
import { MaskInput } from "./mask-input";

type PriceInputProps = FieldBaseProps<string>;

function PriceInput(props: PriceInputProps) {
	return (
		<MaskInput
			inputMode="numeric"
			mask={Number}
			radix="."
			mapToRadix={["."]}
			thousandsSeparator=","
			{...props}
		/>
	);
}

export { PriceInput };
