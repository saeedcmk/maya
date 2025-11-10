"use client";

import { useTranslations } from "next-intl";
import { Fragment } from "react";
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbRoot,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbSkeleton } from "@/components/ui/breadcrumb/breadcrumb-skeleton";
import { useBreadcrumb } from "./use-breadcrumb";

function AppBreadcrumb() {
	const t = useTranslations();

	const { crumbs } = useBreadcrumb();

	return (
		<BreadcrumbRoot className="grow overflow-hidden">
			<BreadcrumbList className="h-5 flex-nowrap truncate">
				{crumbs.length ? (
					crumbs.map((crumb, index) => {
						const isLastItem = index === crumbs.length - 1;

						const label = t(`routes.${crumb.key}`, crumb.params);

						const content = (
							<>
								{typeof crumb.icon !== "undefined" && <crumb.icon />}
								<span>{label}</span>
							</>
						);

						const item = isLastItem ? (
							<BreadcrumbPage>{content}</BreadcrumbPage>
						) : (
							<BreadcrumbLink href={crumb.url}>{content}</BreadcrumbLink>
						);

						return (
							<Fragment key={`${index}-${crumb.url}`}>
								<BreadcrumbItem className="shrink-0">{item}</BreadcrumbItem>
								{!isLastItem && <BreadcrumbSeparator />}
							</Fragment>
						);
					})
				) : (
					<BreadcrumbSkeleton />
				)}
			</BreadcrumbList>
		</BreadcrumbRoot>
	);
}

export { AppBreadcrumb };
