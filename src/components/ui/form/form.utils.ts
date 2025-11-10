import { type useTranslations } from "next-intl";
import { type ApiFailureResponse } from "@/lib/data/api/api-response";
import { getObjectEntries } from "@/lib/utils/object";

function getFieldError<T extends Record<string, any>>(
	error: any,
	values: T
): { fieldName: keyof T; fieldMessage: string } | undefined {
	if (typeof error?.message !== "string") return;

	const [name, message] = (error.message as string).split("::");

	if (name in values) return { fieldName: name, fieldMessage: message };
}

function getFormErrors<T extends Record<string, any>>(
	error: ApiFailureResponse,
	values: T
):
	| {
			fieldName: keyof T | "root" | `root.${string}`;
			fieldMessage: {
				type: "common" | "custom";
				code: string;
				payload?: any;
			};
	  }[]
	| undefined {
	if (typeof error.meta?.fields !== "object") return;

	return getObjectEntries(error.meta.fields).map(([name, message]) => ({
		fieldName:
			name in values
				? name.toString()
				: name !== "root"
					? `root.${name.toString()}`
					: "root",
		fieldMessage:
			typeof message === "object" ? message : { type: "common", code: message },
	}));
}

function getLocalizedFormErrors<T extends Record<string, any>>(
	t: ReturnType<typeof useTranslations>,
	name: string,
	error: ApiFailureResponse,
	values: T
):
	| {
			fieldName: keyof T | "root" | `root.${string}`;
			fieldMessage: string | undefined;
	  }[]
	| undefined {
	return getFormErrors(error, values)?.map(({ fieldName, fieldMessage }) => {
		const errorPath =
			fieldMessage.type === "common"
				? !fieldMessage.payload
					? `errors.${fieldMessage.code}`
					: `errors.${fieldMessage.code}_fn`
				: fieldName.toString().startsWith("root")
					? `${name}.errors.${fieldMessage.code}`
					: `${name}.fields.${fieldName.toString()}.errors.${fieldMessage.code}`;

		return {
			fieldName,
			fieldMessage:
				t(errorPath, fieldMessage.payload ?? {}) || t("errors.unknown"),
		};
	});
}

export { getFieldError, getFormErrors, getLocalizedFormErrors };
