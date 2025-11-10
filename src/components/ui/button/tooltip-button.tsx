import { Slot } from "@radix-ui/react-slot";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { Button, ButtonProps } from "./button.internal";

type TooltipButtonProps = ButtonProps & {
	tooltip: string;
};

function TooltipButton({ asChild, tooltip, ...props }: TooltipButtonProps) {
	const Comp = asChild ? Slot : Button;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Comp {...props} />
			</TooltipTrigger>
			<TooltipContent>{tooltip}</TooltipContent>
		</Tooltip>
	);
}

export type { TooltipButtonProps };
export { TooltipButton };
