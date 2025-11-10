import { NextResponse } from "next/server";

type ApiSuccessResponse<T = undefined> = {
	success: true;
	data: T;
	message?: string;
};

type ApiFailureResponse = {
	success: false;
	error: string;
	errorCode?: string;
	meta?: Record<string, any>;
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

function success<T>(data: T, message?: string) {
	return NextResponse.json<ApiSuccessResponse<T>>({
		success: true,
		data,
		message,
	});
}

function failure(
	error: string = "Something went wrong",
	status: number = 500,
	errorCode?: string,
	meta?: Record<string, any>
) {
	console.error({ status, errorCode, error, meta });

	return NextResponse.json<ApiFailureResponse>(
		{
			success: false,
			error,
			errorCode,
			meta,
		},
		{ status }
	);
}

function isApiFailureResponse(error: any): error is ApiFailureResponse {
	return "success" in error && "error" in error && !error.success;
}

export type { ApiFailureResponse, ApiResponse, ApiSuccessResponse };
export { failure, isApiFailureResponse, success };
