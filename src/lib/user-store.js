const users = [
	{ id: "u_100", name: "Ava", status: "active", email: "ava@example.com" },
	{ id: "u_101", name: "Milo", status: "inactive", email: "milo@example.com" },
]

function listUsers() {
	return users.map((user) => ({ ...user }))
}

function findUserById(userId) {
	return users.find((user) => user.id === userId) ?? null
}

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
