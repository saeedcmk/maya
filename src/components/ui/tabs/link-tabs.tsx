"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "../spinner";
import type { LinkTab } from "./link-tabs.types";
import { TabsList, TabsRoot, TabsTrigger } from "./tabs.primitives";

function isTabActive(tab: LinkTab, pathname: string): boolean {
	if (typeof tab.isActive === "function") {
		return tab.isActive(pathname);
	}

	if (typeof tab.isActive === "string" && tab.isActive === "equals") {
		return tab.href === pathname;
	}

	return pathname.startsWith(tab.href);
}

function LinkTabs({ tabs }: { tabs: LinkTab[] }) {
	const router = useRouter();
	const pathname = usePathname();

	const [value, setValue] = useState<string>("");
	const [selected, setSelected] = useState<LinkTab | null>(null);

	if (!value) {
		const activeTab = tabs.find((tab) => isTabActive(tab, pathname))!;
		setValue(activeTab.value);
		setSelected(activeTab);
	}

	const finalValue = selected?.value ?? value;

	function handleValueChange(value: string) {
		const tab = tabs.find((tab) => tab.value === value)!;
		setSelected(tab);
		router.push(tab.href);
	}

	useEffect(() => {
		const activeTab = tabs.find((tab) => isTabActive(tab, pathname))!;
		setValue(activeTab.value);
		setSelected(activeTab);
	}, [tabs, pathname]);

	const tabListRef = useRef<HTMLDivElement | null>(null);
	const activeTabRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (tabListRef.current && activeTabRef.current) {
			const container = tabListRef.current;
			const active = activeTabRef.current;

			const containerRect = container.getBoundingClientRect();
			const activeRect = active.getBoundingClientRect();

			if (activeRect.left < containerRect.left) {
				// Scroll left to bring active tab fully into view
				container.scrollBy({
					left: activeRect.left - containerRect.left,
					behavior: "smooth",
				});
			} else if (activeRect.right > containerRect.right) {
				// Scroll right to bring active tab fully into view
				container.scrollBy({
					left: activeRect.right - containerRect.right,
					behavior: "smooth",
				});
			}
		}
	}, [finalValue]);

	return (
		<TabsRoot value={finalValue} onValueChange={handleValueChange}>
			<TabsList ref={tabListRef}>
				{tabs.map((tab) => {
					const isActive = tab.value === finalValue;

					return (
						<TabsTrigger
							key={tab.value}
							ref={isActive ? activeTabRef : null}
							value={tab.value}
						>
							<Spinner
								color="white"
								loading={isActive && selected?.value !== value}
								size="xs"
							>
								{tab.icon}
							</Spinner>

							{tab.title}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</TabsRoot>
	);
}

export { LinkTabs };
