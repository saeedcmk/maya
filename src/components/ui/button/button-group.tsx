import { cn } from "@/lib/utils/cn";
import { TooltipProvider } from "../tooltip";

type ButtonGroupProps = React.ComponentProps<"div"> & {
	tooltips?: boolean;
};

function ButtonGroup({ className, tooltips, ...props }: ButtonGroupProps) {
	const content = (
		<div className={cn("flex items-center gap-2", className)} {...props} />
	);

	if (!tooltips) {
		return content;
	}

	return <TooltipProvider>{content}</TooltipProvider>;
}

export type { ButtonGroupProps };
export { ButtonGroup };
