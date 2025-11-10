import { Calendar } from "./calendar";
import type { Locale } from "./locale";

type Language = {
	[key in Locale]: {
		label: string;
		flag: string;
		calendar: Calendar;
		intl?: string;
	};
};

export type { Language };
