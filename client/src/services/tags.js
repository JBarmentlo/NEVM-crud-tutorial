import {api_axios} from './axios_setup';


export const getAllTags = async (sekes_tokens) => {
	// console.log("Get all tags")
	let request = {
		url: "/api/tags/getall", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : sekes_tokens.accessToken,
		},
	};
	let response = await api_axios(request)

	return response
}

export const updateUserTags = async (sekes_tokens, tag_list) => {
	// console.log("Get all tags")
	let request = {
		url: "/api/tags/update", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : sekes_tokens.accessToken,
		},
		data: JSON.stringify({'tag_list': tag_list})
	};
	let response = await api_axios(request)

	return response
}