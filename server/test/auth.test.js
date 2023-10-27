const request = require('supertest')
import { app } from '../app'; // Assuming you have an app.js file where you import and use the routes

jest.mock('../models');

describe('Login', () => {
    test('should fail with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/v1.0/login')
            .send({
                email: 'dummy',
                password: 'demo'
            })
        expect(res.statusCode).toEqual(401)
    })

    //to be checked with a proper DB setup
    test('should succeed with correct credentials', async () => {
        const res = await request(app)
            .post('/api/v1.0/login')
            .send({
                email: 'demo',
                password: 'demo'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ email: 'demo' })
    })
})

describe('Logout', () => {
    //to be checked with a proper DB setup
    test('should logout successfully', async () => {
        const res = await request(app).post('/api/v1.0/logout')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({ ok: true })
    })
})