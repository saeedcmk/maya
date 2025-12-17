import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
	"focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg px-2.5 py-1 text-xs font-normal whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:size-3",
	{
		variants: {
			color: {
				red: "bg-red-100 text-red-900",
				green: "bg-green-100 text-green-900",
				yellow: "bg-yellow-100 text-yellow-900",
				blue: "bg-blue-100 text-blue-900",
				orange: "bg-orange-100 text-orange-900",
				gray: "bg-neutral-100 text-neutral-900",
				darkGray: "bg-neutral-200 text-neutral-900",
			},
		},
		defaultVariants: {
			color: "gray",
		},
	}
);

function Badge({
	className,
	color,
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ color }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
