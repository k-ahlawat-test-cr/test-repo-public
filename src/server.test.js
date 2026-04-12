const test = require("node:test")
const assert = require("node:assert/strict")
const http = require("node:http")

const { server } = require("./server")

function startServer() {
	return new Promise((resolve) => {
		server.listen(0, () => {
			resolve(server.address().port)
		})
	})
}

function stopServer() {
	return new Promise((resolve, reject) => {
		server.close((error) => {
			if (error) {
				reject(error)
				return
			}

			resolve()
		})
	})
}

function makeRequest(port, { method, path, body, headers = {} }) {
	return new Promise((resolve, reject) => {
		const request = http.request(
			{
				host: "127.0.0.1",
				port,
				method,
				path,
				headers,
			},
			(response) => {
				let responseBody = ""

				response.on("data", (chunk) => {
					responseBody += chunk
				})

				response.on("end", () => {
					resolve({
						statusCode: response.statusCode,
						payload: JSON.parse(responseBody),
					})
				})
			},
		)

		request.on("error", reject)

		if (body) {
			request.write(body)
		}

		request.end()
	})
}

test("POST /users rejects duplicate user ids", async () => {
	const port = await startServer()

	try {
		const response = await makeRequest(port, {
			method: "POST",
			path: "/users",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				id: "u_100",
				name: "Duplicate Ava",
			}),
		})

		assert.equal(response.statusCode, 409)
		assert.deepEqual(response.payload, {
			message: "user id already exists",
		})
	} finally {
		await stopServer()
	}
})

test("PATCH /users/:id rejects unsupported statuses", async () => {
	const port = await startServer()

	try {
		const response = await makeRequest(port, {
			method: "PATCH",
			path: "/users/u_100",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				status: "paused",
			}),
		})

		assert.equal(response.statusCode, 400)
		assert.deepEqual(response.payload, {
			message: "status must be either active or inactive",
		})
	} finally {
		await stopServer()
	}
})

test("POST /users returns 400 for invalid JSON", async () => {
	const port = await startServer()

	try {
		const response = await makeRequest(port, {
			method: "POST",
			path: "/users",
			headers: {
				"content-type": "application/json",
			},
			body: '{"id":"u_300",',
		})

		assert.equal(response.statusCode, 400)
		assert.deepEqual(response.payload, {
			message: "Invalid JSON body",
		})
	} finally {
		await stopServer()
	}
})
