const http = require("node:http")

const {
	createUser,
	findUserById,
	listUsers,
	updateUserStatus,
} = require("./lib/user-store")
const { buildInvoiceSummaryShape } = require("./lib/server-contracts")
const { buildInvoiceSummary } = require("./lib/pricing")

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

function mapErrorResponse(error) {
	if (error instanceof SyntaxError) {
		return {
			statusCode: 400,
			payload: { message: "Invalid JSON body" },
		}
	}

	if (error?.code === "INVALID_USER_INPUT") {
		return {
			statusCode: 400,
			payload: { message: error.message },
		}
	}

	if (error?.code === "DUPLICATE_USER") {
		return {
			statusCode: 409,
			payload: { message: error.message },
		}
	}

	return {
		statusCode: 500,
		payload: {
			message: "Unexpected server error",
			error: error instanceof Error ? error.message : "unknown",
		},
	}
}

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

	if (request.method === "POST" && url.pathname === "/contracts/shape") {
		const body = await readJsonBody(request)
		const preview = buildInvoiceSummaryShape(body)

		sendJson(response, 200, { preview })
		return
	}

	sendJson(response, 404, { message: "Route not found" })
}

const server = http.createServer((request, response) => {
	requestHandler(request, response).catch((error) => {
		const { statusCode, payload } = mapErrorResponse(error)
		sendJson(response, statusCode, payload)
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
