import { type Pagination } from "./pagination.internal";
import { UsePaginationReturn } from "./use-pagination";

function parsePaginationArgs(
	pagination: UsePaginationReturn
): Pick<
	React.ComponentProps<typeof Pagination>,
	"page" | "pageSize" | "onPageChange" | "onPageSizeChange"
> {
	return {
		page: pagination.page,
		pageSize: pagination.pageSize,
		onPageChange: pagination.setPage,
		onPageSizeChange: pagination.setPageSize,
	};
}

export { parsePaginationArgs };
