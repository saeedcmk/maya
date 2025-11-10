import { cn } from "@/lib/utils/cn";
import { ButtonGroup, type ButtonGroupProps } from "./button-group";

type IconButtonGroupProps = Omit<ButtonGroupProps, "tooltips">;

function IconButtonGroup({ className, ...props }: IconButtonGroupProps) {
	return <ButtonGroup className={cn("gap-4", className)} tooltips {...props} />;
}

export type { IconButtonGroupProps };
export { IconButtonGroup };
