import { useState } from "react";

type UsePaginationReturn = {
	page: number;
	pageSize: number;
	offset: number;
	from: number;
	to: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
};

function usePagination(): UsePaginationReturn {
	const [page, setPage] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);

	const offset = page * pageSize;
	const from = offset;
	const to = from + pageSize - 1;

	return {
		page,
		pageSize,
		offset,
		from,
		to,
		setPage,
		setPageSize,
	};
}

export type { UsePaginationReturn };
export { usePagination };
