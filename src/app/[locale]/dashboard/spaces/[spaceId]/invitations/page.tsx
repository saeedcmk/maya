import { SpaceInvitationList } from "@/features/space-invitation/components/space-invitation-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";

async function MembersPage() {
	const messages = await getPartialMessages([
		"features.space-invitation.components.space-invitation-list",
		"features.space-invitation.components.space-invitation-create",
	]);

	return (
		<I18nProvider messages={messages}>
			<SpaceInvitationList />
		</I18nProvider>
	);
}

export default MembersPage;
