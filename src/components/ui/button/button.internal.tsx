import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				contained: "",
				outline: "border bg-transparent",
				ghost: "bg-transparent",
				link: "bg-transparent underline-offset-4 hover:underline active:underline",
			},

			color: {
				inverse: "text-background",
				primary: "text-primary-foreground",
				secondary: "text-secondary-foreground",
				destructive: "text-destructive-foreground",
			},

			size: {
				base: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},

		compoundVariants: [
			// Contained variants
			{
				variant: "contained",
				color: "inverse",
				className:
					"bg-foreground hover:bg-foreground/80 active:bg-foreground/90 focus-visible:ring-foreground/30 focus-visible:border-foreground",
			},
			{
				variant: "contained",
				color: "primary",
				className:
					"bg-primary hover:bg-primary/80 active:bg-primary/90 focus-visible:ring-primary/30 focus-visible:border-primary",
			},
			{
				variant: "contained",
				color: "secondary",
				className:
					"bg-secondary hover:bg-secondary/80 active:bg-secondary/90 focus-visible:ring-secondary/30 focus-visible:border-secondary",
			},
			{
				variant: "contained",
				color: "destructive",
				className:
					"bg-destructive hover:bg-destructive/80 active:bg-destructive/90 focus-visible:ring-destructive/30 focus-visible:border-destructive",
			},

			// Outlined variants
			{
				variant: "outline",
				color: "inverse",
				className:
					"border-foreground text-foreground hover:bg-foreground/10 active:bg-foreground/20 focus-visible:ring-foreground/30 focus-visible:border-foreground",
			},
			{
				variant: "outline",
				color: "primary",
				className:
					"border-primary text-primary hover:bg-primary/10 active:bg-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary",
			},
			{
				variant: "outline",
				color: "secondary",
				className:
					"border-secondary text-secondary hover:bg-secondary/10 active:bg-secondary/20 focus-visible:ring-secondary/30 focus-visible:border-secondary",
			},
			{
				variant: "outline",
				color: "destructive",
				className:
					"border-destructive text-destructive hover:bg-destructive/10 active:bg-destructive/20 focus-visible:ring-destructive/30 focus-visible:border-destructive",
			},

			// Ghost variants
			{
				variant: "ghost",
				color: "inverse",
				className:
					"text-foreground hover:bg-foreground/10 active:bg-foreground/20 focus-visible:ring-foreground/30 focus-visible:border-foreground",
			},
			{
				variant: "ghost",
				color: "primary",
				className:
					"text-primary hover:bg-primary/10 active:bg-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary",
			},
			{
				variant: "ghost",
				color: "secondary",
				className:
					"text-secondary hover:bg-secondary/10 active:bg-secondary/20 focus-visible:ring-secondary/30 focus-visible:border-secondary",
			},
			{
				variant: "ghost",
				color: "destructive",
				className:
					"text-destructive hover:bg-destructive/10 active:bg-destructive/20 focus-visible:ring-destructive/30 focus-visible:border-destructive",
			},

			// Link variants
			{
				variant: "link",
				color: "inverse",
				className:
					"text-foreground focus-visible:ring-foreground/30 focus-visible:border-foreground hover:bg-transparent",
			},
			{
				variant: "link",
				color: "primary",
				className:
					"text-primary focus-visible:ring-primary/30 focus-visible:border-primary hover:bg-transparent",
			},
			{
				variant: "link",
				color: "secondary",
				className:
					"text-secondary focus-visible:ring-secondary/30 focus-visible:border-secondary hover:bg-transparent",
			},
			{
				variant: "link",
				color: "destructive",
				className:
					"text-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive hover:bg-transparent",
			},
		],

		defaultVariants: {
			variant: "contained",
			color: "inverse",
			size: "base",
		},
	}
);

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};

function Button({
	asChild = false,
	className,
	color,
	size,
	variant,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(buttonVariants({ variant, color, size, className }))}
			{...props}
		/>
	);
}

export type { ButtonProps };
export { Button, buttonVariants };
