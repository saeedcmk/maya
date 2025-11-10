"use client";

import { PropsWithChildren } from "react";
import { useDeferredToggle } from "@/lib/hooks/use-deferred-toggle";

const Conditional = ({
	children,
	mount,
	delay,
	onUnmount,
}: PropsWithChildren<{
	mount: boolean;
	delay?: number | boolean;
	onUnmount?: () => void;
}>) => {
	const show = useDeferredToggle({
		status: mount,
		delay: typeof delay === "number" ? delay : delay ? undefined : 0,
		onToggleOff: onUnmount,
	});

	return show && children;
};
Conditional.displayName = "Conditional";

export { Conditional };
