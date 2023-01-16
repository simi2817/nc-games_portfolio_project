const request = require('supertest');
const app = require('../app/app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');

beforeEach(()=>
{
    return seed(testData);
});

afterAll(()=>
{
    db.end();
});

describe('GET /api/categories', () =>
{
    test('server responds with 200 status code', () =>
    {
        return request(app)
        .get('/api/categories')
        .expect(200);
    });

    test('server sends response with an array of category objects', () =>
    {
        return request(app)
        .get('/api/categories')
        .then((response) =>
        {
            const { categories } = response.body;
            expect(categories).not.toBe(undefined);
            for(let category of categories)
                expect(typeof category).toBe('object');
        });
    });

    test('to check each category object has slug and description properties', () =>
    {
        return request(app)
        .get('/api/categories')
        .then((response) =>
        {
            const { categories } = response.body;
            for(let category of categories)
            {
                expect(category).toHaveProperty('slug');
                expect(category).toHaveProperty('description');
            }    
        });
    });

    describe('Errors', () =>
    {
        test('server responds with 404 status code for incorrect path provided', () =>
        {
            return request(app)
            .get('/api/category')
            .expect(404)
            .then((response)=>
            {
                expect(response.res.statusMessage).toBe('Not Found');
            });
        });
    });
});