const BASE_URL = "https://santa-smog.onrender.com"

type ApiResponse = Record<string, string | number | boolean>

/**
 *
 * @param {string} path
 * @param {object} query
 */
const get_request = async <Response extends ApiResponse>(
	path: string,
	query: Record<string, string> = {}
) => {
	if (!path) {
		throw new Error("please pass a path param")
	}
	const queryKeys = Object.keys(query)
	const hasQueryParams = queryKeys.length > 0
	const queryKeyWithValues = hasQueryParams
		? queryKeys.map(queryKey => `${queryKey}=${query[queryKey]}`)
		: []
	const query_params = hasQueryParams ? `?${queryKeyWithValues.join("&")}` : ""

	let response = {} as Response
	try {
		const request = await fetch(`${BASE_URL}${path}${query_params}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-type": "application/json",
			},
		})

		if (request.status == 200) {
			const _response = await request.json()
			response = _response["data"] ?? {}
		} else {
			console.warn("[api-get-request]", query?.message)
		}
	} catch (e) {
		if (e instanceof Error) {
			console.error("[api-get-request]", e.message)
		} else {
			console.error("[api-get-request]", e)
		}
	} finally {
		return response
	}
}

/**
 *
 * @param {string} path
 * @param {object} body
 */
const post_request = async <
	Body extends ApiResponse,
	Response extends ApiResponse
>(
	path: string,
	body: Body
) => {
	if (!path && !path.startsWith("/")) {
		throw new Error("please pass a path param starting with /")
	}
	const hasBody = !!body

	let response = {} as Response
	try {
		const request = await fetch(`${BASE_URL}${path}`, {
			method: "POST",
			...(hasBody && { body: JSON.stringify(body) }),
			headers: {
				accept: "application/json",
				"content-type": "application/json",
			},
		})

		if (request.status == 200) {
			response = await request.json()
		} else {
			console.warn("[api-post-request]", request.status)
		}
	} catch (e) {
		if (e instanceof Error) {
			console.error("[api-post-request]", e.message)
		} else {
			console.error("[api-post-request]", e)
		}
	} finally {
		return response
	}
}

export const api = {
	get: get_request,
	post: post_request,
}
