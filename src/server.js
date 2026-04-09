const http = require("node:http")

const {
	createUser,
	findUserById,
	listUsers,
	updateUserStatus,
} = require("./lib/user-store")
const { buildDiscountPreview } = require("./lib/discounts")
const { buildInvoiceSummary } = require("./lib/pricing")

/**
 * Parse the incoming HTTP request body as JSON and return the resulting object.
 * @param {import('http').IncomingMessage} request - Incoming HTTP request whose body will be consumed.
 * @returns {Promise<Object>} The parsed JSON object, or an empty object if the body is empty. Rejects with the JSON parse error or the request stream error.
 */
function readJsonBody(request) {
	return new Promise((resolve, reject) => {
		let body = ""

		request.on("data", (chunk) => {
			body += chunk
		})

		request.on("end", () => {
			if (!body) {
				resolve({})
				return
			}

			try {
				resolve(JSON.parse(body))
			} catch (error) {
				reject(error)
			}
		})

		request.on("error", reject)
	})
}

function sendJson(response, statusCode, payload) {
	response.writeHead(statusCode, {
		"content-type": "application/json",
	})
	response.end(JSON.stringify(payload))
}

/**
 * Handle incoming HTTP requests and send JSON responses for the configured API routes.
 *
 * Routes:
 * - GET / -> { service: "feature-test-repo", ok: true } (200)
 * - GET /users -> { users: listUsers() } (200)
 * - GET /users/:id -> { user } (200) or { message: "User not found" } (404)
 * - POST /users -> creates a user from JSON body and returns { user } (201)
 * - PATCH /users/:id -> updates user status from JSON body and returns { user } (200) or { message: "User not found" } (404)
 * - POST /invoices/preview -> returns { summary } built from JSON body (200)
 * - POST /discounts/preview -> returns { preview } built from JSON body (200)
 * - any other method/path -> { message: "Route not found" } (404)
 *
 * @param {import('http').IncomingMessage} request - The incoming HTTP request.
 * @param {import('http').ServerResponse} response - The HTTP response to send JSON to.
 */
async function requestHandler(request, response) {
	const url = new URL(request.url, "http://localhost")

	if (request.method === "GET" && url.pathname === "/") {
		sendJson(response, 200, { service: "feature-test-repo", ok: true })
		return
	}

	if (request.method === "GET" && url.pathname === "/users") {
		sendJson(response, 200, { users: listUsers() })
		return
	}

	if (request.method === "GET" && url.pathname.startsWith("/users/")) {
		const userId = url.pathname.replace("/users/", "")
		const user = findUserById(userId)
		if (!user) {
			sendJson(response, 404, { message: "User not found" })
			return
		}

		sendJson(response, 200, { user })
		return
	}

	if (request.method === "POST" && url.pathname === "/users") {
		const body = await readJsonBody(request)
		const user = createUser(body)
		sendJson(response, 201, { user })
		return
	}

	if (request.method === "PATCH" && url.pathname.startsWith("/users/")) {
		const userId = url.pathname.replace("/users/", "")
		const body = await readJsonBody(request)
		const user = updateUserStatus(userId, body.status)

		if (!user) {
			sendJson(response, 404, { message: "User not found" })
			return
		}

		sendJson(response, 200, { user })
		return
	}

	if (request.method === "POST" && url.pathname === "/invoices/preview") {
		const body = await readJsonBody(request)
		const summary = buildInvoiceSummary(
			body.customerName,
			body.items ?? [],
			body.taxRate ?? 0.08,
		)

		sendJson(response, 200, { summary })
		return
	}

	if (request.method === "POST" && url.pathname === "/discounts/preview") {
		const body = await readJsonBody(request)
		const preview = buildDiscountPreview(body)

		sendJson(response, 200, { preview })
		return
	}

	sendJson(response, 404, { message: "Route not found" })
}

const server = http.createServer((request, response) => {
	requestHandler(request, response).catch((error) => {
		sendJson(response, 500, {
			message: "Unexpected server error",
			error: error instanceof Error ? error.message : "unknown",
		})
	})
})

if (require.main === module) {
	server.listen(3000, () => {
		process.stdout.write("Server listening on http://localhost:3000\n")
	})
}

module.exports = {
	readJsonBody,
	requestHandler,
	server,
}
