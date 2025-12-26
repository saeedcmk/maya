import { PageCrumb } from "@/components/app/breadcrumb/page-crumb";
import { toCrumb } from "@/components/ui/breadcrumb/breadcrumb.utils";
import { MyInvitationHistoryList } from "@/features/space-invitation/components/my-invitation-history-list";
import { MyPendingInvitationList } from "@/features/space-invitation/components/my-pending-invitation-list";
import { I18nProvider } from "@/lib/i18n/components/i18n-provider";
import { usePartialMessages } from "@/lib/i18n/hooks/use-partial-messages";
import { routes } from "@/lib/routes";

function InvitationsPage() {
	const messages = usePartialMessages([
		"features.space-invitation.components.my-pending-invitation-list",
		"features.space-invitation.components.my-invitation-history-list",
	]);

	return (
		<>
			<PageCrumb crumb={toCrumb(routes.invitations)} />
			<I18nProvider messages={messages}>
				<MyPendingInvitationList />
				<MyInvitationHistoryList />
			</I18nProvider>
		</>
	);
}

export default InvitationsPage;
