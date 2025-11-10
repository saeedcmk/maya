import { cn } from "@/lib/utils/cn";
import { TooltipButton, type TooltipButtonProps } from "./tooltip-button";

type IconButtonProps = TooltipButtonProps;

function IconButton({ className, children, ...props }: IconButtonProps) {
	return (
		<TooltipButton
			asChild
			className={cn("cursor-pointer *:size-4", className)}
			{...props}
		>
			<button>{children}</button>
		</TooltipButton>
	);
}

export type { IconButtonProps };
export { IconButton };
