import { cn } from "@/lib/utils/cn";
import { IconButton, IconButtonProps } from "../button/icon-button";
import {
	IconButtonGroup,
	IconButtonGroupProps,
} from "../button/icon-button-group";

function TableRoot({ className, ...props }: React.ComponentProps<"table">) {
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto"
		>
			<table
				data-slot="table"
				className={cn("w-full caption-bottom", className)}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn("bg-muted cursor-default", className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn(
				"[&>tr]:hover:bg-muted/50",
				// "[&_tr:last-child]:border-0",
				className
			)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"bg-muted/50 border-t font-normal [&>tr]:last:border-b-0",
				className
			)}
			{...props}
		/>
	);
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"data-[state=selected]:bg-muted border-muted border-b transition-colors",
				className
			)}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				"text-muted-foreground px-4 py-4 text-start align-middle font-normal whitespace-nowrap first:ps-6 last:pe-6 [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-0.5",
				className
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
	return (
		<td
			data-slot="table-cell"
			className={cn(
				"px-4 py-4 align-middle whitespace-nowrap first:ps-6 last:pe-6 [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-0.5",
				className
			)}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("text-muted-foreground mt-4", className)}
			{...props}
		/>
	);
}

function TableActions(props: IconButtonGroupProps) {
	return <IconButtonGroup data-slot="table-actions" {...props} />;
}

function TableAction(props: IconButtonProps) {
	return <IconButton data-slot="table-action" {...props} />;
}

export {
	TableAction,
	TableActions,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRoot,
	TableRow,
};
