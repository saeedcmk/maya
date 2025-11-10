type SelectOptionGroup<T extends string | number = string> = {
	label: string;
	options: SelectOptionItem<T>[];
};

type SelectOptionItem<T extends string | number = string> = {
	value: T;
	label?: string;
};

type SelectOption<T extends string | number = string> =
	| SelectOptionGroup<T>
	| SelectOptionItem<T>;

export type { SelectOption, SelectOptionGroup, SelectOptionItem };
