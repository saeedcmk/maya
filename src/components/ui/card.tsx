import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

function Card({
	asChild,
	children,
	className,
	...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "div";

	return (
		<Comp
			data-slot="card"
			className={cn(
				"text-card-foreground bg-card border-muted shadow-muted flex flex-col gap-6 rounded-lg border py-6 shadow-lg",
				className
			)}
			{...props}
		>
			{children}
		</Comp>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header flex flex-col gap-x-2.5 gap-y-3 px-6 sm:flex-row [.border-b]:pb-6",
				className
			)}
			{...props}
		/>
	);
}

function CardInfo({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-info"
			className={cn("flex min-h-8 flex-col justify-center gap-1.5", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("text-sm leading-none", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
}

const cardActionsVariants = cva(
	"ms-auto flex flex-col flex-wrap items-end gap-1.5",
	{
		variants: {
			breakpoint: {
				xs: "",
				sm: "sm:flex-row",
				md: "md:flex-row",
				lg: "lg:flex-row",
				xl: "xl:flex-row",
				"2xl": "2xl:flex-row",
				none: "flex-row",
			},
		},
		defaultVariants: {
			breakpoint: "none",
		},
	}
);

type CardActionsProps = React.ComponentProps<"div"> &
	VariantProps<typeof cardActionsVariants>;

function CardActions({ breakpoint, className, ...props }: CardActionsProps) {
	return (
		<div
			data-slot="card-action"
			className={cn(cardActionsVariants({ breakpoint }), className)}
			{...props}
		/>
	);
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardContent({
	className,
	...props
}: React.ComponentProps<typeof CardBody>) {
	return <CardBody className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardActions,
	CardBody,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardInfo,
	CardTitle,
};
