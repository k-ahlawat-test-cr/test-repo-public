const http = require("node:http")

const {
	createUser,
	findUserById,
	listUsers,
	updateUserStatus,
} = require("./lib/user-store")
const { buildInvoiceSummary } = require("./lib/pricing")

/**
 * Parse the request's JSON body into a JavaScript value.
 * @param {import('http').IncomingMessage} request - Incoming HTTP request whose body will be read.
 * @returns {any} The parsed JSON value, or an empty object when the request body is empty.
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

/**
 * Send a JSON response with the specified HTTP status code and payload.
 * @param {import('http').ServerResponse} response - The HTTP response object to write to.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {*} payload - The value to serialize as JSON in the response body.
 */
function sendJson(response, statusCode, payload) {
	response.writeHead(statusCode, {
		"content-type": "application/json",
	})
	response.end(JSON.stringify(payload))
}

/**
 * Handle incoming HTTP requests and send JSON responses for the server's API routes.
 *
 * Routes:
 * - GET / : returns service health { service, ok } with 200.
 * - GET /users : returns { users: listUsers() } with 200.
 * - GET /users/:id : returns { user } with 200 or { message: "User not found" } with 404.
 * - POST /users : reads JSON body, creates a user, and returns { user } with 201.
 * - PATCH /users/:id : reads JSON body, updates user status, returns { user } with 200 or 404 if not found.
 * - POST /invoices/preview : reads JSON body, returns { summary } computed from customerName, items (defaults to []), and taxRate (defaults to 0.08) with 200.
 * - All other routes : returns { message: "Route not found" } with 404.
 *
 * @param {import('http').IncomingMessage} request - The incoming HTTP request.
 * @param {import('http').ServerResponse} response - The HTTP response used to send JSON payloads.
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
