import { type NextRequest, NextResponse } from "next/server";
import { failure } from "@/lib/data/api/api-response";
import { prisma } from "@/lib/prisma";
import { verifyAuthentication } from "./verify-authentication";

type WithAuthApiHandler<P extends Record<string, string>> = (
	request: NextRequest,
	options: {
		params: Promise<P>;
		user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
	}
) => Promise<NextResponse>;

function withAuthApi<P extends Record<string, string>>(
	handler: WithAuthApiHandler<P>
) {
	return async function (
		request: NextRequest,
		options: { params: Promise<P> }
	) {
		const response = new NextResponse();

		try {
			const result = await verifyAuthentication(request, response, () =>
				failure("Authentication required", 401, "UNAUTHORIZED")
			);

			if (!result.success) {
				return result.response;
			}

			const user = await prisma.user.findUnique({
				where: { id: result.userId },
			});

			if (!user) {
				return failure("Authentication required", 401, "UNAUTHORIZED");
			}

			const handlerResponse = await handler(request, { ...options, user });

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

export type { WithAuthApiHandler };
export { withAuthApi };
