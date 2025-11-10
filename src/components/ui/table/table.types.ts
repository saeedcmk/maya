import { useTranslations } from "next-intl";

type TableColumn<TType extends object, TContext extends object = object> = {
	key: keyof TType | (string & {});
	title: string | ((t: ReturnType<typeof useTranslations>) => string);
	render?:
		| string
		| ((
				item: TType,
				args: {
					t: ReturnType<typeof useTranslations>;
					isLoading: boolean;
					context: TContext;
					index: number;
					offset: number;
				}
		  ) => React.ReactNode);
	defaultValue?: string;
	width?: string | number;
	className?: string;
	if?: boolean;
	skeleton?: number | (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)[];
};

export type { TableColumn };
