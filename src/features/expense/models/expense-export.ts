import type { Prisma } from "@prisma/client";
import type { Locale } from "@/lib/i18n/types/locale";

type ExpenseExportArgs = Pick<
	Prisma.ExpenseFindManyArgs,
	"where" | "orderBy"
> & { locale?: Locale };

export type { ExpenseExportArgs };
