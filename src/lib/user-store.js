const users = [
	{ id: "u_100", name: "Ava", status: "active", email: "ava@example.com" },
	{ id: "u_101", name: "Milo", status: "inactive", email: "milo@example.com" },
]

const VALID_USER_STATUSES = new Set(["active", "inactive"])

function createStoreError(message, code) {
	const error = new Error(message)
	error.code = code
	return error
}

function validateRequiredString(value, fieldName) {
	if (typeof value !== "string" || value.trim() === "") {
		throw createStoreError(`${fieldName} is required`, "INVALID_USER_INPUT")
	}
}

function validateStatus(status) {
	if (!VALID_USER_STATUSES.has(status)) {
		throw createStoreError(
			"status must be either active or inactive",
			"INVALID_USER_INPUT",
		)
	}
}

function listUsers() {
	return users.map((user) => ({ ...user }))
}

function findUserById(userId) {
	return users.find((user) => user.id === userId) ?? null
}

function createUser(input) {
	validateRequiredString(input?.id, "id")
	validateRequiredString(input?.name, "name")

	if (users.some((user) => user.id === input.id)) {
		throw createStoreError("user id already exists", "DUPLICATE_USER")
	}

	const status = input.status ?? "active"
	validateStatus(status)

	const user = {
		id: input.id,
		name: input.name,
		status,
		email: input.email ?? null,
	}

	users.push(user)
	return { ...user }
}

function updateUserStatus(userId, status) {
	const user = users.find((entry) => entry.id === userId)
	if (!user) {
		return null
	}

	validateStatus(status)
	user.status = status
	return { ...user }
}

module.exports = {
	listUsers,
	findUserById,
	createUser,
	updateUserStatus,
}
