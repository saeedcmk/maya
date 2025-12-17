import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { buttonVariants } from "./button";

const alertVariants = cva(
	"relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg px-4 py-3 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	{
		variants: {
			intent: {
				danger: "bg-red-100 text-red-900",
				success: "bg-green-100 text-green-900",
				warning: "bg-yellow-100 text-yellow-900",
				info: "bg-blue-100 text-blue-900",
				neutral: "bg-neutral-100 text-neutral-900",
				elevated: "bg-neutral-200 text-neutral-900",
			},
			color: {},
		},
		defaultVariants: {
			intent: "neutral",
		},
	}
);

function Alert({
	className,
	intent,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ intent }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 line-clamp-1 min-h-4 font-bold tracking-tight",
				className
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"col-start-2 grid justify-items-start gap-1 [&_p]:leading-relaxed",
				className
			)}
			{...props}
		/>
	);
}

function AlertActions({
	align = "end",
	className,
	...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
	return (
		<div
			data-slot="alert-actions"
			className={cn(
				"col-start-2 -ms-3 flex flex-wrap gap-x-1 gap-y-1",
				align === "start" && "justify-start",
				align === "end" && "justify-end",
				className
			)}
			{...props}
		/>
	);
}

function AlertAction({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="alert-action"
			className={cn(
				buttonVariants({
					variant: "ghost",
					size: "sm",
				}),
				"font-bold text-current hover:bg-current/10 focus-visible:border-current focus-visible:ring-current/30 active:bg-current/20",
				className
			)}
			{...props}
		/>
	);
}

export { Alert, AlertAction, AlertActions, AlertDescription, AlertTitle };
