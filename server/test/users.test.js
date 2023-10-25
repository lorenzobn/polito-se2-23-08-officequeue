import request from 'supertest';
import { app } from '../app'; // Assuming you have an app.js file where you import and use the routes
import { User } from '../models';

jest.mock('../models');


beforeEach(() => {
    User.findAll.mockClear();
});


describe("getUsers", () => {
    //how to test with authorization
    test("should retrieve list of all users ", async () => {

        const req = {
            isAuthenticated: jest.fn(() => true),
            user: {
                type: 5
            }
        }

        const retrievedUsers = [{ type: '1', firstName: 'Tony', lastName: 'Montana', email: 'test1@example.com', phone: '338333333' }, { type: '1', firstName: 'Regina', lastName: 'Elisabetta', email: 'test2@example.com', phone: '336333333' } ]

        jest.spyOn(User, "findAll").mockImplementation(() => retrievedUsers)
        const response = await request(app)
            .get("/api/v1.0/users")

        //expect(response.status).toBe(200)
        expect(response.body).toEqual(retrievedUsers)
    })
})

// Register User

// Update User