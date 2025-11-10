"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";
import { useLoggedInUser } from "@/features/auth/hooks/use-logged-in-user";
import { SpaceFeatureFindManyArgs } from "@/features/space-feature/models/space-feature-find-many";
import { findManySpaceFeature } from "@/features/space-feature/services/find-many-space-feature";
import { resolveSpaceFeatureMap } from "@/features/space-feature/utils/resolve-space-feature-map";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { SpaceContext, type SpaceContextType } from "../contexts/space-context";
import type { SpaceFindUniqueArgs } from "../models/space-find-unique";
import { findUniqueSpace } from "../services/find-unique-space";
import { isSpaceOwnerOrAdmin } from "../utils/isSpaceOwnerOrAdmin";

const featureQueryArgs = {
	where: { expiresAt: null },
	include: { feature: true },
} satisfies SpaceFeatureFindManyArgs;

const SpaceProvider = ({
	spaceId,
	...props
}: React.PropsWithChildren & { spaceId: string }) => {
	const { session } = useLoggedInUser();

	const spaceQueryArgs = {
		where: { id: spaceId },
		include: {
			owner: true,
			members: {
				where: { status: SpaceMemberStatus.ACTIVE },
				include: { user: true },
			},
		},
	} satisfies SpaceFindUniqueArgs;

	const {
		data: space,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["spaces", spaceId, "root", spaceQueryArgs],
		queryFn: () => findUniqueSpace(spaceQueryArgs),
		placeholderData: keepPreviousData,
	});

	const { data: features, isLoading: isLoadingFeatures } = useQuery({
		queryKey: ["spaces", spaceId, "features", featureQueryArgs],
		queryFn: () =>
			findManySpaceFeature(spaceId, featureQueryArgs).then((spaceFeatures) =>
				resolveSpaceFeatureMap(spaceFeatures.map((x) => x.feature))
			),
		placeholderData: keepPreviousData,
	});

	const isOwnerOrAdmin = useMemo(
		() => (space ? isSpaceOwnerOrAdmin(space, session.userId) : false),
		[space, session.userId]
	);

	const contextValue = useMemo<SpaceContextType>(
		() => ({ space: space!, features: features!, isOwnerOrAdmin, isLoading }),
		[space, features, isOwnerOrAdmin, isLoading]
	);

	if (isLoading || isLoadingFeatures) {
		return <Loading size="sm" />;
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
		);
	}

	if (!space) {
		notFound();
	}

	return <SpaceContext value={contextValue} {...props} />;
};

export { SpaceProvider };
