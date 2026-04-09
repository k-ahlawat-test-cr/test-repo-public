const users = [
	{ id: "u_100", name: "Ava", status: "active", email: "ava@example.com" },
	{ id: "u_101", name: "Milo", status: "inactive", email: "milo@example.com" },
]

/**
 * Get a shallow-cloned array of all users.
 *
 * @returns {Array<Object>} An array of user objects where each object is a shallow copy of an internal user record.
 */
function listUsers() {
	return users.map((user) => ({ ...user }))
}

/**
 * Retrieve the user with the specified id.
 * @param {string} userId - The id of the user to find.
 * @returns {Object|null} The matching user object if found, `null` otherwise.
 */
function findUserById(userId) {
	return users.find((user) => user.id === userId) ?? null
}

/**
 * Create a new user and add it to the in-memory users array.
 *
 * @param {Object} input - Properties for the new user.
 * @param {string} input.id - Unique identifier for the user.
 * @param {string} input.name - User's display name.
 * @param {string} [input.status] - User status; defaults to `"active"` if omitted.
 * @param {string|null} [input.email] - User email; defaults to `null` if omitted.
 * @returns {Object} The created user object (shallow clone) with `id`, `name`, `status`, and `email`.
 */
function createUser(input) {
	const user = {
		id: input.id,
		name: input.name,
		status: input.status ?? "active",
		email: input.email ?? null,
	}

	users.push(user)
	return { ...user }
}

/**
 * Update a user's status in the in-memory users store.
 *
 * Mutates the matching user's status and returns a shallow-cloned copy of the updated user.
 * @param {string} userId - The identifier of the user to update.
 * @param {string} status - The new status value to assign to the user.
 * @returns {Object|null} The updated user object (shallow clone) if found; `null` if no user with the given `userId` exists.
 */
function updateUserStatus(userId, status) {
	const user = users.find((entry) => entry.id === userId)
	if (!user) {
		return null
	}

	user.status = status
	return { ...user }
}

module.exports = {
	listUsers,
	findUserById,
	createUser,
	updateUserStatus,
}
