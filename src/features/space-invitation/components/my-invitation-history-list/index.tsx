import { MyInvitationHistoryListProvider } from "./my-invitation-history-list-provider.internal";
import { MyInvitationHistoryListWidget } from "./my-invitation-history-list-widget.internal";

function MyInvitationHistoryList() {
	return (
		<MyInvitationHistoryListProvider>
			<MyInvitationHistoryListWidget />
		</MyInvitationHistoryListProvider>
	);
}

export { MyInvitationHistoryList };
