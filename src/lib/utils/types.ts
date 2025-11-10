import type { UsePaginationReturn } from "@/components/ui/pagination/use-pagination";

type EntityListContextType<T> = {
	isLoading: boolean;
	error: Error | null;
	items: T[] | undefined;
};

type EntityListWithPaginationContextType<T> = EntityListContextType<T> & {
	count: number | undefined;
	pagination: UsePaginationReturn;
};

type Noop = () => void;

type RefCallBack = (instance: any) => void;

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

type NonNullableFields<T> = {
	[K in keyof T]: NonNullable<T[K]>;
};

type IsPlainObject<T> = T extends object
	? T extends (...args: any) => any
		? false
		: T extends any[]
			? false
			: T extends null
				? false
				: true
	: false;

type WithDateToString<T> = {
	[K in keyof T]: T[K] extends Date
		? string
		: T[K] extends Array<infer U>
			? WithDateToString<U>[]
			: IsPlainObject<T[K]> extends true
				? WithDateToString<T[K]>
				: T[K];
};

type WithApi<T> = WithDateToString<T>;

export type {
	EntityListContextType,
	EntityListWithPaginationContextType,
	NonNullableFields,
	Noop,
	RefCallBack,
	WithApi,
	WithDateToString,
	WithOptional,
	WithRequired,
};
