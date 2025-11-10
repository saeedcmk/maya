type ObjectProperty<T extends object> = ((obj: T) => string) | keyof T;

export type { ObjectProperty };
