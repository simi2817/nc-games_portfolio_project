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
            .then(({ body })=>
            {
                expect(body.message).toBe('Path Not Found');
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
            .then(({ body })=>
            {
                expect(body.message).toBe('Path Not Found');
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
});

describe('GET /api/reviews/:review_id', () =>
{
    test('server responds with 200 status code', () =>
    {
        return request(app)
        .get('/api/reviews/5')
        .expect(200);
    });
    test('server responds with a review object for given review_id', () =>
    {
        return request(app)
        .get('/api/reviews/5')
        .then((response) =>
        {
            const { review } = response.body;

            expect(review).toHaveLength(1);

            //checking the review_id
            expect(review[0].review_id).toBe(5);

            //checking all the properties
            expect(review[0]).toHaveProperty('owner');
            expect(review[0]).toHaveProperty('title');
            expect(review[0]).toHaveProperty('review_id');
            expect(review[0]).toHaveProperty('category');
            expect(review[0]).toHaveProperty('review_img_url');
            expect(review[0]).toHaveProperty('created_at');
            expect(review[0]).toHaveProperty('votes');
            expect(review[0]).toHaveProperty('designer');
        });
    });

    describe('Errors', () =>
    {
        test('server responds with 404 status code for incorrect review_id', () =>
        {
            return request(app)
            .get('/api/reviews/100')
            .expect(404)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('review_id not found!');
            });
        });

        test('server responds with 400 status code for bad request made', () =>
        {
            return request(app)
            .get('/api/reviews/games')
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid input!');
            });
        });

        test('server responds with 404 status code for incorrect path name', () =>
        {
            return request(app)
            .get('/api/review/3')
            .expect(404)
            .then(({ body }) =>
            {
                expect(body.message).toBe('Path Not Found');
            });
        });
    });
});

describe.only('GET /api/reviews/:review_id/comments', () =>
{
    test('server responds with 200 status code', () =>
    {
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200);
    });

    test('server responds with an array of comment objects for given review_id', () =>
    {
        return request(app)
        .get('/api/reviews/3/comments')
        .then((response) =>
        {
            const { comments } = response.body;

            expect(comments).toHaveLength(3);

            for(let comment of comments)
            {
                expect(comment.review_id).toBe(3);

                expect(comment).toHaveProperty('comment_id', expect.any(Number));
                expect(comment).toHaveProperty('votes', expect.any(Number));
                expect(comment).toHaveProperty('created_at', expect.any(String));
                expect(comment).toHaveProperty('author', expect.any(String));
                expect(comment).toHaveProperty('body', expect.any(String));
            }
        });
    });

    test('server responds with an array of comment objects sorted by recent comments', () =>
    {
        return request(app)
        .get('/api/reviews/3/comments')
        .then((response) =>
        {
            const { comments } = response.body;

            expect(comments[0].created_at.includes('2021-03-27')).toBe(true);
            expect(comments).toBeSorted({key: 'created_at',
                descending: true});
        });
    });

    describe('Errors', () =>
    {
        test('server responds with 404 status code for incorrect review_id', () =>
        {
            return request(app)
            .get('/api/reviews/100/comments')
            .expect(404)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('review_id not found!');
            });
        });

        test('server responds with 400 status code for bad request made', () =>
        {
            return request(app)
            .get('/api/reviews/supermario/comments')
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid input!');
            });
        });
    })
});