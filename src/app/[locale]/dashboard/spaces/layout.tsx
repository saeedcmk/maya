import { PageCrumb } from "@/components/app/breadcrumb/page-crumb";
import { toCrumb } from "@/components/ui/breadcrumb/breadcrumb.utils";
import { routes } from "@/lib/routes";

function SpacesLayout({ children }: React.PropsWithChildren) {
	return (
		<>
			<PageCrumb crumb={toCrumb(routes.spaces)} />
			{children}
		</>
	);
}

export default SpacesLayout;
