import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { getPartialMessages } from "@/lib/i18n/utils/get-partial-messages";
import { LogoutButton } from "./_module/logout-button";
import { PendingInvitationsAlert } from "./_module/pending-invitations-alert";
import { UserInfo } from "./_module/user-info";

async function DashboardPage() {
	const messages = await getPartialMessages([
		"app.dashboard.root.logout-button",
		"features.space-invitation.components.pending-invitations-alert",
	]);

	return (
		<I18nProvider messages={messages}>
			<PendingInvitationsAlert />
			<UserInfo />
			<LogoutButton />
		</I18nProvider>
	);
}

export default DashboardPage;
