import { type NextRequest, NextResponse } from "next/server";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { failure } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";
import type { SpaceFeatureMap } from "../types/space-feature-map";
import { resolveSpaceFeatureMap } from "./resolve-space-feature-map";

type WithSpaceFeatureApiHandler<P extends Record<string, string>> = (
	request: NextRequest,
	options: {
		params: Promise<P>;
		user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
		features: SpaceFeatureMap;
	}
) => Promise<NextResponse>;

function withSpaceFeatureApi<P extends Record<string, string>>(
	handler: WithSpaceFeatureApiHandler<P>
) {
	return async (
		request: NextRequest,
		options: {
			params: Promise<P>;
			user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
		}
	) => {
		const { params, user } = options;

		const response = new NextResponse();

		try {
			const { spaceId } = await params;

			const features = await prisma.spaceFeature
				.findMany({
					where: {
						space: {
							id: spaceId,
							OR: [
								{ ownerId: user.id },
								{
									members: {
										some: {
											userId: user.id,
											status: SpaceMemberStatus.ACTIVE,
										},
									},
								},
							],
						},
					},
					include: { feature: true },
				})
				.then((spaceFeatures) =>
					resolveSpaceFeatureMap(spaceFeatures.map((x) => x.feature))
				);

			const handlerResponse = await handler(request, {
				...options,
				features,
			});

			return copyResponseMeta(handlerResponse, response);
		} catch (err) {
			console.error(err?.toString());
			return failure("Internal server error", 500, "INTERNAL_ERROR");
		}
	};
}

function copyResponseMeta(to: NextResponse, from?: NextResponse): NextResponse {
	from?.headers.forEach((value, key) => {
		to.headers.set(key, value);
	});

	from?.cookies.getAll().forEach((cookie) => {
		to.cookies.set(cookie.name, cookie.value, cookie);
	});

	return to;
}

export { withSpaceFeatureApi };
