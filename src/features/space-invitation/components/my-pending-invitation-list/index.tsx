import { MyPendingInvitationListProvider } from "./my-pending-invitation-list-provider.internal";
import { MyPendingInvitationListWidget } from "./my-pending-invitation-list-widget.internal";

function MyPendingInvitationList() {
	return (
		<MyPendingInvitationListProvider>
			<MyPendingInvitationListWidget />
		</MyPendingInvitationListProvider>
	);
}

export { MyPendingInvitationList };
