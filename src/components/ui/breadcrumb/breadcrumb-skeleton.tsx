"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
	BreadcrumbItem,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../breadcrumb";
import { Skeleton } from "../skeleton";

function BreadcrumbSkeleton() {
	const pathname = usePathname();
	const count = pathname.split("/").length - 1;

	return Array.from({ length: count }).map((_, index) => (
		<Fragment key={`${index}-skeleton`}>
			<BreadcrumbItem>
				<BreadcrumbPage>
					<Skeleton className="h-4 w-16" />
				</BreadcrumbPage>
			</BreadcrumbItem>

			{index !== count - 1 && <BreadcrumbSeparator />}
		</Fragment>
	));
}

export { BreadcrumbSkeleton };
