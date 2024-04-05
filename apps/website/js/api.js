import { ENV } from "./env"
const BASE_URL = ENV.API_URL

/**
 *
 * @param {string} path
 * @param {object} query
 */
const get_request = async (path, query = {}) => {
	if (!path) {
		throw new Error("please pass a path param")
	}
	const queryKeys = Object.keys(query)
	const hasQueryParams = queryKeys.length > 0
	const queryKeyWithValues = hasQueryParams
		? queryKeys.map(queryKey => `${queryKey}=${query[queryKey]}`)
		: []
	const query_params = hasQueryParams ? `?${queryKeyWithValues.join("&")}` : ""

	let response = {}
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
		console.error("[api-get-request]", e.message)
	} finally {
		return response
	}
}

/**
 *
 * @param {string} path
 * @param {object} body
 */
const post_request = async (path, body) => {
	if (!path && !path.startsWith("/")) {
		throw new Error("please pass a path param starting with /")
	}
	const hasBody = !!body

	let response = {}
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
			console.warn("[api-post-request]", request?.message)
		}
	} catch (e) {
		console.error("[api-post-request]", e.message)
	} finally {
		return response
	}
}

export const api = {
	get: get_request,
	post: post_request,
}
