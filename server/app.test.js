const { Pool } = require("pg");
const request = require("supertest");
const app = require("./index");

jest.mock("pg", () => {
    const mPool = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();

const mockUsers = [
    { id: 1, first_name: "yahya", last_name: "ghdemsi", email: "yahya@gmail.com", phone: "123456789" },
    { id: 2, first_name: "anwer", last_name: "ben abdallah", email: "anwer@gmail.com", phone: "987654321" },
];

describe("Integration Tests for User API", () => {
    const pool = new Pool();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a welcome message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("User CRUD API");
    });

    it("should fetch all users", async () => {
        pool.query.mockResolvedValueOnce({ rows: mockUsers });

        const res = await request(app).get("/users/all");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            data: mockUsers,
        });
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users ORDER BY created_at DESC");
    });

    it("should create a new user", async () => {
        const newUser = { first_name: "Alice", last_name: "Smith", email: "alice@example.com", phone: "555123456" };
        const createdUser = { id: 3, ...newUser };

        pool.query.mockResolvedValueOnce({ rows: [createdUser] });

        const res = await request(app).post("/users").send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            success: true,
            data: createdUser,
        });
        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO users (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [newUser.first_name, newUser.last_name, newUser.email, newUser.phone]
        );
    });

    it("should update an existing user", async () => {
        const userId = 1;
        const updatedFields = { first_name: "Johnathan", email: "johnathan@example.com" };
        const updatedUser = { id: userId, last_name: "Doe", phone: "123456789", ...updatedFields };

        pool.query.mockResolvedValueOnce({ rows: [updatedUser] });

        const res = await request(app).put(`/users/${userId}`).send(updatedFields);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            data: updatedUser,
        });
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE users SET first_name = $1, email = $2 WHERE id = $3 RETURNING *",
            [updatedFields.first_name, updatedFields.email, userId]
        );
    });

    it("should delete a user", async () => {
        const userId = 1;

        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "User deleted successfully",
        });
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [userId]);
    });


    it("should return 404 when trying to delete a non-existent user", async () => {
        const userId = 999;

        pool.query.mockResolvedValueOnce({ rowCount: 0 });

        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "User not found",
        });
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [userId]);
    });

});
