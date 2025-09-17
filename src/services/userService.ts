import { User, UserForCreation, UsersRepository } from "../domain/user";

export class UserService {
  constructor(private repository: UsersRepository) { }

  getUsers({ pagination, limit, filters }: { pagination: number, limit: number, filters?: { name?: string, role?: string, status?: string, date?: string } }) {
    return this.repository.get({ pagination, limit, filters });
  }

  getUserById(id: number): User {
    const user = this.repository.getById(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  createUser(data: UserForCreation): User {
    this.validateUserDate(data)
    return this.repository.save(data);
  }

  updateUser(id: number, data: UserForCreation): void {
    this.validateUserDate(data)
    this.repository.update(id, data);
  }

  deleteUser(id: number): void {
    const user = this.repository.getById(id);
    if (!user) throw new Error("User not found");
    if (user.role === "Admin") throw new Error("Cannot delete Admin users");
    this.repository.removeById(id);
  }

  toCsv() {
    const users = this.repository.get({ pagination: 1, limit: Number.MAX_SAFE_INTEGER }).users;
    const header = "id,name,username,email,role,status,createdAt\n";
    const rows = users.map(user => `${user.id},${user.name},${user.username},${user.email},${user.role},${user.status},${user.createdAt}`).join("\n");
    return header + rows;
  }

  private validateUserDate(data: UserForCreation) {
    const missingFields: string[] = []
    if (!data.name) missingFields.push("name");
    if (!data.email) missingFields.push("email");
    if (!data.role) missingFields.push("role");
    if (!data.status) missingFields.push("status");
    if (!data.password) missingFields.push("password");
    if (!data.confirm_password) missingFields.push("confirm_password");
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(", ")}`);
    }
    if (data.password !== data.confirm_password) {
      throw new Error("Password and confirm password do not match");
    }
  }
}
