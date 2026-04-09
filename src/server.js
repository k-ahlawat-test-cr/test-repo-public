const http = require("node:http")

const {
	createUser,
	findUserById,
	listUsers,
	updateUserStatus,
} = require("./lib/user-store")
const {
	buildDiscountContractPreview,
	buildInvoiceContractPreview,
} = require("./lib/contracts-preview")
const { buildPricingAudit } = require("./lib/pricing-audit")
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

	if (request.method === "POST" && url.pathname === "/pricing/audit") {
		const body = await readJsonBody(request)
		const audit = buildPricingAudit(body)

		sendJson(response, 200, { audit })
		return
	}

	if (request.method === "POST" && url.pathname === "/contracts/invoice") {
		const body = await readJsonBody(request)
		const preview = buildInvoiceContractPreview(body)

		sendJson(response, 200, { preview })
		return
	}

	if (request.method === "POST" && url.pathname === "/contracts/discount") {
		const body = await readJsonBody(request)
		const preview = buildDiscountContractPreview(body)

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
