import { MyInvitationListProvider } from "./my-invitation-list-provider.internal";
import { MyInvitationListWidget } from "./my-invitation-list-widget.internal";

function MyInvitationList() {
	return (
		<MyInvitationListProvider>
			<MyInvitationListWidget />
		</MyInvitationListProvider>
	);
}

export { MyInvitationList };
