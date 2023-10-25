const request = require('supertest')
import { app } from '../app' // Assuming you have an app.js file where you import and use the routes
import { Ticket, ServiceType, Counter } from '../models';

jest.mock('../models');

beforeEach(() => {
    ServiceType.create.mockClear();
    ServiceType.findOne.mockClear();
    Counter.create.mockClear();
    Counter.findByPk.mockClear();
    Ticket.create.mockClear();
    Ticket.findByPk.mockClear();
    Ticket.findAll.mockClear();
});
describe('addServiceType', () => {
    test('should create a new service type', async () => {
        const service = "data"
        jest.spyOn(ServiceType, "create").mockImplementation(() => service)
        const response = await request(app)
            .post("/api/v1.0/service-types")

        expect(response.status).toBe(201)
        expect(response.body.data).toEqual(service)
    });
});

describe('addCounter', () => {
    test('error, serviceTypeTagNames are required', async () => {
        const req = {
            body: null
        }
        const counter = {
            addServiceType: jest.fn((serviceType) => true)
        }

        jest.spyOn(Counter, "create").mockImplementation(() => counter)
        const response = await request(app)
            .post("/api/v1.0/counters")

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual("serviceTypeTagNames are required")
    });

    test('should add a new counter', async () => {
        const req = {
                serviceTypeTagNames: ["tonno"]
        }
        const counter = {
            addServiceType: jest.fn((serviceType) => true)
        }

        jest.spyOn(Counter, "create").mockImplementation(() => counter)
        jest.spyOn(ServiceType, "findOne").mockImplementation(() => true)

        const response = await request(app)
            .post("/api/v1.0/counters")
            .send(req)

        expect(response.status).toBe(201)
    });
});

describe('addTicket', () => {
    test('error, invalid serviceTypeTagName', async () => {
        const req = {
            name: "name"
        }
        const service = "service"

        jest.spyOn(ServiceType, "findOne").mockImplementation(() => null)
        const response = await request(app)
            .post("/api/v1.0/tickets")
            .send(req)

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual("invalid serviceTypeTagName")
    });

    test('should add a new ticket', async () => {
        const req = {
            body: "name"
        }
        const service = {
            id: "a",
            open: true
        }
        const ticket = "ticket"

        jest.spyOn(ServiceType, "findOne").mockImplementation(() => service)
        jest.spyOn(Ticket, "create").mockImplementation(() => ticket)

        const response = await request(app)
            .post("/api/v1.0/tickets")
            .send(req)

        expect(response.status).toBe(201)
        expect(response.body.data).toEqual(ticket)
    });
});

describe('serveNextTicket', () => {
    test('error, invalid counter number', async () => {
        const req = {
            body: 3
        }
        const service = "service"

        jest.spyOn(Counter, "findByPk").mockImplementationOnce((num) => null)

        const response = await request(app)
            .post("/api/v1.0/tickets/serve-next")
            .send(req)

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual("invalid counter number")
    });

    test('error, internal server error', async () => {
        const req = {
            body: 3
        }
        const service = "service"

        jest.spyOn(Counter, "findByPk").mockImplementationOnce((num) => true)
        jest.spyOn(Ticket, "findByPk").mockImplementationOnce((counter) => null)


        const response = await request(app)
            .post("/api/v1.0/tickets/serve-next")
            .send(req)

        expect(response.status).toBe(500)
        expect(response.body.msg).toEqual("internal server error")
    });

    test('error, counter serves no service type', async () => {
        const req = {
            body: 3
        }
        const counter = {
            getServiceTypes: jest.fn((serviceType) => null)
        }
        const ticket = {
            status: 0,
            save: jest.fn((serviceType) => true)
        }

        jest.spyOn(Counter, "findByPk").mockImplementationOnce((num) => counter)
        jest.spyOn(Ticket, "findByPk").mockImplementationOnce((counter) => ticket)


        const response = await request(app)
            .post("/api/v1.0/tickets/serve-next")
            .send(req)

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual("counter serves no service type")
    });

    test('should serve next ticket', async () => {
        const req = {
            body: 3
        }
        const counter = {
            getServiceTypes: jest.fn((serviceType) => [{id: "a"}, {id: "b"}, {id: "c"}]),
            currentTicketId: 3,
            save: jest.fn(() => true)
        }
        const ticket = {
            status: 0,
            save: jest.fn((serviceType) => true)
        }
        const queue1 = [
            {
                serviceType: "a",
                customerId: 3,
                status: 1
            },
            {
                serviceType: "a",
                customerId: 5,
                status: 1
            },
            {
                serviceType: "a",
                customerId: 9,
                status: 1
            }
        ]
        const queue2 = [
            {
                serviceType: "b",
                customerId: 3,
                status: 1
            }
        ]

        const queue3 = [
            {
                serviceType: "c",
                customerId: 3,
                status: 1,
                save: jest.fn(() => true)
            },
            {
                serviceType: "c",
                customerId: 5,
                status: 1,
                save: jest.fn(() => true)
            },
            {
                serviceType: "c",
                customerId: 8,
                status: 1,
                save: jest.fn(() => true)
            },
            {
                serviceType: "c",
                customerId: 1,
                status: 1,
                save: jest.fn(() => true)
            }
        ]

        jest.spyOn(Counter, "findByPk").mockImplementationOnce((num) => counter)
        jest.spyOn(Ticket, "findByPk").mockImplementationOnce((counter) => ticket)
        jest.spyOn(Ticket, "findAll").mockImplementationOnce((counter) => queue1)
        jest.spyOn(Ticket, "findAll").mockImplementationOnce((counter) => queue2)
        jest.spyOn(Ticket, "findAll").mockImplementationOnce((counter) => queue3)


        const response = await request(app)
            .post("/api/v1.0/tickets/serve-next")
            .send(req)

        expect(response.status).toBe(201)
        expect(response.body.data.customerId).toEqual(1)
    });
});

describe('getCurrentTicket', () => {
    test('error, invalid counter number', async () => {
        const tickets = [
            {
                customerId: 6,
                status: 2
            },
            {
                customerId: 3,
                status: 2
            }]
        const service = "service"

        jest.spyOn(Ticket, "findAll").mockImplementationOnce((num) => tickets)
        const response = await request(app)
            .get("/api/v1.0/tickets/current")

        expect(response.status).toBe(200)
        expect(response.body.data.customerId).toEqual(3)
    });
});
