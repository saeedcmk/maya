import ky, { type KyInstance } from "ky";

function kyClient(baseURL?: string): KyInstance {
	return ky.create({
		prefixUrl: baseURL,
		hooks: {
			beforeError: [
				async (error) => {
					const response = await error.response.json();
					throw response;
				},
			],
		},
	});
}

const apiClient = kyClient("/api").extend({
	retry: 0,
});

export { apiClient, kyClient };
