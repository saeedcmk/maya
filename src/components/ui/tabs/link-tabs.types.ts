type LinkTab = {
	value: string;
	href: string;
	title?: string;
	icon?: React.ReactNode;
	isActive?: "equals" | "startsWith" | ((pathname: string) => boolean);
};

export type { LinkTab };
