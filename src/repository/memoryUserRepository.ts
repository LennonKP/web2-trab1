import { User, UserForCreation, UsersRepository } from "../domain/user"

export class MemoryUsersRepository implements UsersRepository {
    private users: User[]
    constructor() {
        this.users = [
            { id: 1, name: 'Vinicius', username: 'vinicius', email: 'vinicius@email.com', role: 'Admin', status: 'Active', createdAt: '2025-07-04', password: 'password' },
            { id: 2, name: 'Maria', username: 'maria', email: 'maria@email.com', role: 'Manager', status: 'Suspended', createdAt: '2025-07-05', password: 'password' },
            { id: 3, name: 'João', username: 'joao', email: 'joao@email.com', role: 'User', status: 'Active', createdAt: '2025-07-06', password: 'password' },
            { id: 4, name: 'Ana', username: 'ana', email: 'ana@email.com', role: 'User', status: 'Invited', createdAt: '2025-07-07', password: 'password' },
            { id: 5, name: 'Carlos', username: 'carlos', email: 'carlos@email.com', role: 'Manager', status: 'Active', createdAt: '2025-07-08', password: 'password' },
            { id: 6, name: 'Fernanda', username: 'fernanda', email: 'fernanda@email.com', role: 'Admin', status: 'Suspended', createdAt: '2025-07-09', password: 'password' },
            { id: 7, name: 'Lucas', username: 'lucas', email: 'lucas@email.com', role: 'User', status: 'Active', createdAt: '2025-07-10', password: 'password' },
            { id: 8, name: 'Paula', username: 'paula', email: 'paula@email.com', role: 'Manager', status: 'Invited', createdAt: '2025-07-11', password: 'password' }
        ]
    }

    get({ pagination, limit, filters }: { pagination: number, limit: number, filters?: { name?: string, role?: string, status?: string, date?: string } }) {
        if (pagination < 1) pagination = 1
        
        const filteredUsers = this.users.filter(user => {
            if (filters?.name && !user.name.toLowerCase().includes(filters.name.toLowerCase())) return false
            if (filters?.role && user.role !== filters.role) return false
            if (filters?.status && user.status !== filters.status) return false
            return true
        })

        let orderedUsers = [...filteredUsers]
        if (filters?.date) {
            if (filters.date === "Sort: Newest") {
                orderedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            } else if (filters.date === "Sort: Oldest") {
                orderedUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            } else if (filters.date === "Sort: A → Z") {
                orderedUsers.sort((a, b) => a.name.localeCompare(b.name))
            } else if (filters.date === "Sort: Z → A") {
                orderedUsers.sort((a, b) => b.name.localeCompare(a.name))
            }
        }

        const users = orderedUsers.slice((pagination - 1) * limit, pagination * limit)
        
        return { users, pagination, limit, total: this.users.length }
    }

    getById(id: number): User | undefined {
        return this.users.find(user => user.id === id)
    }

    save(user: UserForCreation): User {
        const newUser = { ...user, id: this.users.length + 1, createdAt: new Date().toISOString().split('T')[0] }
        this.users.push(newUser)
        return newUser
    }

    removeById(id: number): void {
        this.users = this.users.filter(user => user.id !== id)
    }

    update(id: number, user: Omit<User, "id" | "createdAt">): void {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error("User not found");
        }
        this.users[index] = { ...this.users[index], ...user };
    }
}
