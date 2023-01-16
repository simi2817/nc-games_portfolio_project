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

            expect(categories.length).toBeGreaterThan(0);

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

            expect(categories.length).toBeGreaterThan(0);

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

describe('GET /api/reviews', () =>
{
    test('server responds with 200 status code', () =>
    {
        return request(app)
        .get('/api/reviews')
        .expect(200);
    });

    test('server sends response with an array of review objects', () =>
    {
        return request(app)
        .get('/api/reviews')
        .then((response) =>
        {
            const { reviews } = response.body;
            
            expect(reviews).not.toBe(undefined);
            
            expect(reviews.length).toBeGreaterThan(0);
            for(let review of reviews)
                expect(typeof review).toBe('object');
        });
    });

    test('to check each review object has relevant properties including comment_count', () =>
    {
        return request(app)
        .get('/api/reviews')
        .then((response) =>
        {
            const { reviews } = response.body;
            
            expect(reviews.length).toBeGreaterThan(0);

            for(let review of reviews)
            {
                expect(review).toHaveProperty('owner');
                expect(review).toHaveProperty('title');
                expect(review).toHaveProperty('review_id');
                expect(review).toHaveProperty('category');
                expect(review).toHaveProperty('review_img_url');
                expect(review).toHaveProperty('created_at');
                expect(review).toHaveProperty('votes');
                expect(review).toHaveProperty('designer');
                expect(review).toHaveProperty('comment_count');
            }    
        });
    });

    test('to check if the dates are fetched in descending order', ()=>
    {
        return request(app)
        .get('/api/reviews')
        .then((response) =>
        {
            const { reviews } = response.body;
            expect(reviews[0].created_at.includes('2021-01-18')).toBe(true);
            expect(reviews).toBeSorted({key: 'created_at',
                descending: true});
        });
    });

    describe('Errors', () =>
    {
        test('server responds with 404 status code for incorrect path provided', () =>
        {
            return request(app)
            .get('/api/review')
            .expect(404)
            .then((response)=>
            {
                expect(response.res.statusMessage).toBe('Not Found');
            });
        });

        test('to check if the responded review objects are sorted according to date in descending order by default', () =>
        {
            return request(app)
            .get('/api/reviews')
            .then((response)=>
            {
                const { reviews } = response.body;
                expect(reviews[0].created_at.includes('1970-01-10')).toBe(false);
                expect(reviews).toBeSorted({key: 'created_at',
                ascending: false});
            });
        });
    });
})