const { Pool } = require("pg");

jest.mock("pg", () => {
    const mPool = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();
const { getAllUsers, createUser, updateUser, deleteUser } = require("./crud");

describe("CRUD Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch all users", async () => {
        const mockUsers = [
            { id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", phone: "123456789" },
        ];

        pool.query.mockResolvedValueOnce({ rows: mockUsers });

        const users = await getAllUsers();

        expect(users).toEqual(mockUsers);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users ORDER BY created_at DESC");
    });

    it("should create a user", async () => {
        const newUser = {
            first_name: "Jane",
            last_name: "Doe",
            email: "jane@example.com",
            phone: "987654321",
        };
        const createdUser = { id: 2, ...newUser };

        pool.query.mockResolvedValueOnce({ rows: [createdUser] });

        const result = await createUser(newUser);

        expect(result).toEqual(createdUser);
        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO users (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [newUser.first_name, newUser.last_name, newUser.email, newUser.phone]
        );
    });

    it("should update a user", async () => {
        const userId = 1;
        const updatedFields = { first_name: "Johnathan", email: "johnathan@example.com" };
        const updatedUser = { id: userId, ...updatedFields, last_name: "Doe", phone: "123456789" };

        pool.query.mockResolvedValueOnce({ rows: [updatedUser] });

        const result = await updateUser(userId, updatedFields);

        expect(result).toEqual(updatedUser);
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE users SET first_name = $1, email = $2 WHERE id = $3 RETURNING *",
            [updatedFields.first_name, updatedFields.email, userId]
        );
    });

    it("should delete a user", async () => {
        const userId = 1;

        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const result = await deleteUser(userId);

        expect(result).toBe(true);
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [userId]);
    });

});
