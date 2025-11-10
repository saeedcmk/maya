import { type LucideIcon } from "lucide-react";

type Breadcrumb<T extends object = any> = {
	key: string;
	icon?: LucideIcon;
	url: string;
	params?: T;
};

export type { Breadcrumb };
