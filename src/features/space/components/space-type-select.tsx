"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Select, type SelectProps } from "@/components/ui/select";
import type { SelectOptionItem } from "@/components/ui/select/select.types";
import { getObjectEntries } from "@/lib/utils/object";
import { SpaceType } from "../enums/space-type";

function SpaceTypeSelect({ ...props }: Omit<SelectProps, "options">) {
	const t = useTranslations();

	const options = useMemo<SelectOptionItem[]>(
		() =>
			getObjectEntries(SpaceType).map(([k]) => ({
				value: k,
				label: t(`space-type.${k}`),
			})),
		[t]
	);

	return <Select options={options} {...props} />;
}

export { SpaceTypeSelect };
