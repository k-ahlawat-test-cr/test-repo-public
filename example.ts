export interface UserRecord {
	id: string
	name: string
	status: "active" | "inactive"
}

export class UserService {
	private readonly users: UserRecord[]

	public constructor(seedUsers: UserRecord[] = []) {
		this.users = [...seedUsers]
	}

	public listActiveUsers(): UserRecord[] {
		return this.users.filter((user) => user.status === "active")
	}

	public addUser(user: UserRecord): void {
		this.users.push(user)
	}
}
