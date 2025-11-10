"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Select, type SelectProps } from "@/components/ui/select";
import type { SelectOptionItem } from "@/components/ui/select/select.types";
import { getObjectEntries } from "@/lib/utils/object";
import { SpaceMemberRole } from "../enums/space-member-role";

function SpaceMemberRoleSelect({
	excludeOwner,
	...props
}: Omit<SelectProps, "options"> & Partial<{ excludeOwner: boolean }>) {
	const t = useTranslations();

	const options = useMemo<SelectOptionItem[]>(() => {
		let options: SelectOptionItem[] = getObjectEntries(SpaceMemberRole).map(
			([k]) => ({ value: k, label: t(`space-member-role.${k}`) })
		);

		if (excludeOwner) {
			options = options.filter(
				(option) => option.value !== SpaceMemberRole.OWNER
			);
		}

		return options;
	}, [t, excludeOwner]);

	return <Select options={options} {...props} />;
}

export { SpaceMemberRoleSelect };
