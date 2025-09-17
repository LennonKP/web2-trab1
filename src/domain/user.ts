export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    role: "Admin" | "Manager" | "User";
    status: "Active" | "Suspended" | "Invited";
    createdAt: string;
};

export interface UsersRepository {
    get({ pagination, limit, filters }: { pagination: number, limit: number, filters?: { name?: string, role?: string, status?: string, date?: string } }): {
        users: User[];
        pagination: number;
        limit: number;
        total: number;
    };
    getById(id: number): User | undefined;
    save(user: Omit<User, 'id' | 'createdAt'>): User;
    removeById(id: number): void;
    update(id: number, user: Omit<User, 'id' | 'createdAt'>): void
}

export type UserForCreation = {
    name: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    role: "Admin" | "Manager" | "User";
    status: "Active" | "Suspended" | "Invited";
}

