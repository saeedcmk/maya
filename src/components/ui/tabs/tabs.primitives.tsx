"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";

const TabsRoot = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Root>) => (
	<TabsPrimitive.Root className={cn("", className)} {...props} />
);

const TabsList = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.List>) => (
	<TabsPrimitive.List
		className={cn(
			"bg-muted text-muted-foreground inline-flex h-12 w-full overflow-x-auto rounded-lg px-2 py-1",
			className
		)}
		{...props}
	/>
);

const TabsTrigger = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) => (
	<TabsPrimitive.Trigger
		className={cn(
			"ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:relative data-[state=active]:top-1 data-[state=active]:cursor-default data-[state=active]:rounded-b-none [&_svg]:me-2 [&_svg:not([class*='size-'])]:size-4",
			className
		)}
		{...props}
	/>
);

const TabsContent = ({
	className,
	...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Content>) => (
	<TabsPrimitive.Content
		className={cn(
			"ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
			className
		)}
		{...props}
	/>
);

export { TabsContent, TabsList, TabsRoot, TabsTrigger };
