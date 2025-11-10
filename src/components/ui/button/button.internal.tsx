import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
	"dark:hover:bg-foreground/ focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				contained: "",
				outline: "hover:text-opacity-90 border bg-transparent",
				ghost: "hover:bg-opacity-10 bg-transparent",
				link: "bg-transparent underline-offset-4 shadow-none hover:underline",
			},

			color: {
				default: "border-background text-background hover:bg-background/10",
				gray: "border-border text-background hover:bg-border/10",
				primary: "border-primary text-primary-foreground hover:bg-primary/10",
				secondary:
					"border-secondary text-secondary-foreground hover:bg-secondary/10",
				destructive:
					"border-destructive text-destructive-foreground hover:bg-destructive/10",
			},

			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},

		compoundVariants: [
			// Contained variants
			{
				variant: "contained",
				color: "default",
				className: "bg-foreground hover:bg-foreground/90",
			},
			{
				variant: "contained",
				color: "gray",
				className: "bg-border hover:bg-border/90",
			},
			{
				variant: "contained",
				color: "primary",
				className: "bg-primary hover:bg-primary/90",
			},
			{
				variant: "contained",
				color: "secondary",
				className: "bg-secondary hover:bg-secondary/80",
			},
			{
				variant: "contained",
				color: "destructive",
				className: "bg-destructive hover:bg-destructive/90",
			},

			// Outlined variants
			{
				variant: "outline",
				color: "default",
				className: "border-foreground text-foreground",
			},
			{
				variant: "outline",
				color: "gray",
				className: "text-foreground border-border",
			},
			{
				variant: "outline",
				color: "primary",
				className: "border-primary text-primary",
			},
			{
				variant: "outline",
				color: "secondary",
				className: "border-secondary text-secondary",
			},
			{
				variant: "outline",
				color: "destructive",
				className: "border-destructive text-destructive",
			},

			// Ghost variants
			{
				variant: "ghost",
				color: "default",
				className: "text-foreground hover:bg-foreground/10",
			},
			{
				variant: "ghost",
				color: "gray",
				className: "text-foreground hover:bg-neutral-400/10",
			},
			{
				variant: "ghost",
				color: "primary",
				className: "text-primary hover:bg-primary/10",
			},
			{
				variant: "ghost",
				color: "secondary",
				className: "text-secondary hover:bg-secondary/10",
			},
			{
				variant: "ghost",
				color: "destructive",
				className: "text-destructive hover:bg-destructive/10",
			},

			// Link variants
			{
				variant: "link",
				color: "default",
				className: "text-foreground hover:bg-transparent",
			},
			{
				variant: "link",
				color: "gray",
				className: "text-foreground hover:bg-transparent",
			},
			{
				variant: "link",
				color: "primary",
				className: "text-primary hover:bg-transparent",
			},
			{
				variant: "link",
				color: "secondary",
				className: "text-secondary hover:bg-transparent",
			},
			{
				variant: "link",
				color: "destructive",
				className: "text-destructive hover:bg-transparent",
			},
		],

		defaultVariants: {
			variant: "contained",
			color: "default",
			size: "default",
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
