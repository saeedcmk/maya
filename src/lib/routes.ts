import type { LucideIcon } from "lucide-react";

type Route<TParams extends object = object> = {
	key: string;
	icon?: LucideIcon;
	url: (params: TParams extends object ? TParams : undefined) => string;
};

const routes = {
	dashboard: {
		key: "dashboard",
		url: () => "/dashboard",
	} satisfies Route,

	spaces: {
		key: "spaces",
		url: () => "/dashboard/spaces",
	} satisfies Route,

	space: {
		key: "space",
		url: ({ id }: { id: string }) => `/dashboard/spaces/${id}`,

		members: {
			key: "members",
			url: ({ spaceId }: { spaceId: string }) =>
				`/dashboard/spaces/${spaceId}/members`,
		} satisfies Route<{ spaceId: string }>,

		invitations: {
			key: "invitations",
			url: ({ spaceId }: { spaceId: string }) =>
				`/dashboard/spaces/${spaceId}/invitations`,
		} satisfies Route<{ spaceId: string }>,

		categories: {
			key: "space_categories",
			url: ({ spaceId }: { spaceId: string }) =>
				`/dashboard/spaces/${spaceId}/categories`,
		} satisfies Route<{ spaceId: string }>,

		expenses: {
			key: "space_expenses",
			url: ({ spaceId }: { spaceId: string }) =>
				`/dashboard/spaces/${spaceId}/expenses`,
		} satisfies Route<{ spaceId: string }>,
	},

	invitations: {
		key: "invitations",
		url: () => "/dashboard/invitations",
	} satisfies Route,
} as const;

export type { Route };
export { routes };
