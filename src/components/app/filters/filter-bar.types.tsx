import { type useTranslations } from "next-intl";

type FilterBarConfigItem<T extends Record<string, any>, K extends keyof T> = {
	title?: string | ((t: ReturnType<typeof useTranslations>) => string);
	render?:
		| string
		| ((
				item: T[K],
				args: {
					t: ReturnType<typeof useTranslations>;
				}
		  ) => React.ReactNode);
	count?: (item: T[K]) => number;
};

type FilterBarConfig<T extends Record<string, any>> = {
	[K in keyof T]: FilterBarConfigItem<T, K>;
};

export type { FilterBarConfig };
