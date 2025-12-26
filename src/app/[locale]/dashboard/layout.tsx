import { AppBreadcrumb } from "@/components/app/breadcrumb";
import { BreadcrumbProvider } from "@/components/app/breadcrumb/breadcrumb-provider";
import { Sidebar } from "@/components/app/sidebar";
import { toCrumb } from "@/components/ui/breadcrumb/breadcrumb.utils";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSessionOrThrowServer } from "@/features/auth/services/server/get-session-or-throw-server";
import { type SpaceLookup } from "@/features/space/types/space-lookup";
import { SpaceMemberStatus } from "@/features/space-member/enums/space-member-status";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getDirection } from "@/lib/i18n/utils/get-direction";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { LoggedInUserGuard } from "./_module/logged-in-user-guard";

async function DashboardLayout({
	children,
	params,
}: React.PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
	const { locale } = await params;
	const { side } = getDirection(locale);

	const messages = await getPartialMessages([
		"app.root.routes",
		"app.dashboard.root.sidebar",
		"app.dashboard.root.language",
		{ path: "features.user.types", spread: true },
		{ path: "features.space.types", spread: true },
		{ path: "features.space-member.types", spread: true },
		{ path: "features.space-invitation.types", spread: true },
		{ path: "features.category.types", spread: true },
		{ path: "features.expense.types", spread: true },
		"features.space.components.space-create",
	]);

	const { userId } = await getSessionOrThrowServer();

	const spaces: SpaceLookup[] = await prisma.space.findMany({
		where: {
			OR: [
				{ ownerId: userId },
				{ members: { some: { userId, status: SpaceMemberStatus.ACTIVE } } },
			],
		},
		orderBy: { name: "asc" },
		select: { id: true, name: true, type: true },
	});

	return (
		<LoggedInUserGuard>
			<I18nProvider messages={messages}>
				<SidebarProvider
					style={
						{
							"--sidebar-width": "16rem",
						} as React.CSSProperties
					}
				>
					<Sidebar side={side} spaces={spaces} />
					<SidebarInset className="max-w-full pt-4">
						<BreadcrumbProvider initialState={[toCrumb(routes.dashboard)]}>
							<header className="bg-muted sticky top-0 z-10 h-12 shrink-0 px-6 py-3">
								<div className="flex h-full w-full items-center gap-2">
									<SidebarTrigger />

									<Separator
										className="me-2 h-4"
										decorative
										orientation="vertical"
									/>

									<AppBreadcrumb />
								</div>
							</header>

							<div className="space-y-6 p-6">{children}</div>
						</BreadcrumbProvider>
					</SidebarInset>
				</SidebarProvider>
			</I18nProvider>
		</LoggedInUserGuard>
	);
}

export default DashboardLayout;
