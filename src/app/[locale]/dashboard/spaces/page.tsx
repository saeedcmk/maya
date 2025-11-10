import { SpaceList } from "@/features/space/components/space-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { usePartialMessages } from "@/lib/i18n/hooks/use-partial-messages";

function SpacesPage() {
	const messages = usePartialMessages([
		"features.space.components.space-list",
		"features.space.components.space-create",
		"features.space.components.space-update",
	]);

	return (
		<I18nProvider messages={messages}>
			<SpaceList />
		</I18nProvider>
	);
}

export default SpacesPage;
