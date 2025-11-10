import { SpaceProvider } from "@/features/space/components/space-provider";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";
import { SpaceLayoutHeader } from "./_module/space-layout-header";

const SpaceLayout = async ({
	children,
	params,
}: React.PropsWithChildren & { params: Promise<{ spaceId: string }> }) => {
	const { spaceId } = await params;

	const messages = await getPartialMessages([
		{ path: "app.dashboard.spaces.space.layout", spread: true },
	]);

	return (
		<I18nProvider messages={messages}>
			<SpaceProvider spaceId={spaceId}>
				<SpaceLayoutHeader />
				{children}
			</SpaceProvider>
		</I18nProvider>
	);
};

export default SpaceLayout;
