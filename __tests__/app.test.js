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
            expect(reviews[0].created_at.includes('2021-01-25')).toBe(true);
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
                descending: true});
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

describe('GET /api/reviews/:review_id/comments', () =>
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
    });
});

describe('POST /api/reviews/:review_id/comments', () =>
{
    test('server responds with 201 status code and the new comment added', () =>
    {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({
            username: 'bainesface',
            body: 'Fantastic game ever!'
        })
        .expect(201)
        .then((response) =>
        {
            const { comment } = response.body;
            
            expect(comment).toHaveLength(1);

            //checking if the comment_id has been incremented
            expect(comment[0].comment_id).toBe(7);

            //checking the added values
            expect(comment[0].review_id).toBe(1);
            expect(comment[0].body).toBe('Fantastic game ever!');
            expect(comment[0].author).toBe('bainesface');
        });
    });

    describe('Errors', () =>
    {
        test('server responds with 404 status code for incorrect review_id not present in reviews table', () =>
        {
            return request(app)
            .post('/api/reviews/14/comments')
            .send({
                username: 'bainesface',
                body: 'Fantastic game ever!'
            })
            .expect(404)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('review_id not found!');
            });
        });

        test('server responds with 400 status code for bad review_id inputs', () =>
        {
            return request(app)
            .post('/api/reviews/games/comments')
            .send({
                username: 'bainesface',
                body: 'Fantastic game ever!'
            })
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid input!');
            });
        });

        test('server responds with 400 status code if no body is provided', () =>
        {
            return request(app)
            .post('/api/reviews/1/comments')
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('request body is empty!');
            });
        });

        test('server responds with 400 status code if keys are incorrect in request body', () =>
        {
            return request(app)
            .post('/api/reviews/1/comments')
            .expect(400)
            .send({
                name: 'bainesface',
                description: 'Fantastic game ever!'
            })
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('request body is missing keys of username & body!');
            });
        });
    });
});

describe('PATCH /api/reviews/:review_id', () =>
{
    test('server responds with status - 200 and an updated review object for given positive number', () =>
    {
        return request(app)
        .patch('/api/reviews/1')
        .send({
            inc_votes: 1
        })
        .expect(200)
        .then((response) => 
        {
            const { review } = response.body;

            expect(review.votes).toBe(2);
        });
    });

    test('server responds with  with status - 200 and an updated review object for given negative number', () =>
    {
        return request(app)
        .patch('/api/reviews/9')
        .send({
            inc_votes: -3
        })
        .expect(200)
        .then((response) => 
        {
            const { review } = response.body;

            expect(review.votes).toBe(7);
        });
    });

    describe('Errors', () =>
    {
        test('404 - incorrect review_id provided', () =>
        {
            return request(app)
            .patch('/api/reviews/15')
            .send({
                inc_votes: -3
            })
            .expect(404)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('review_id not found!');
            });

        });

        test('400 - incorrect data type for review_id provided', () =>
        {
            return request(app)
            .patch('/api/reviews/games')
            .send({
                inc_votes: -3
            })
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid input!');
            });
        });

        test('400 - incorrect data type for votes to be updated is provided', () =>
        {
            return request(app)
            .patch('/api/reviews/1')
            .send({
                inc_votes: 'to be incremented by 1'
            })
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid input!');
            });
        });

        test('400 - no request body is provided', () =>
        {
            return request(app)
            .patch('/api/reviews/1')
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('request body is empty!');
            });
        });

        test('400 - incorrect key provided in the request body', () =>
        {
            return request(app)
            .patch('/api/reviews/1')
            .send({
                update_votes: 3
            })
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('request body must have inc_votes key!');
            });
        });
    });
});

describe('GET /api/users', () =>
{
    test('server sends response with 200 status code and an array of user objects', () =>
    {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) =>
        {
            const { users } = response.body;
            expect(users).not.toBe(undefined);

            expect(users.length).toBeGreaterThan(0);

            for(let user of users)
                expect(typeof user).toBe('object');
        });
    });

    test('to check each user object has username,name & avatar_url properties', () =>
    {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) =>
        {
            const { users } = response.body;

            expect(users.length).toBeGreaterThan(0);

            for(let user of users)
            {
                expect(user).toHaveProperty('username', expect.any(String));
                expect(user).toHaveProperty('name', expect.any(String));
                expect(user).toHaveProperty('avatar_url', expect.any(String));
            }    
        });
    });
});

describe('GET /api/reviews (queries)', () =>
{
    test('server responds with review object for a given category', () =>
    {
        return request(app)
        .get('/api/reviews?category=social deduction')
        .expect(200)
        .then((response) =>
        {
            const { reviews } = response.body;

            expect(reviews.length).toBeGreaterThan(0);

            for(let review of reviews)
                expect(review.category).toBe('social deduction');
        })
    });

    test('server responds with review object sorted as per given column_name', () =>
    {
        return request(app)
        .get('/api/reviews?sort_by=designer')
        .expect(200)
        .then((response) =>
        {
            const { reviews } = response.body;

            expect(reviews[0].designer).toBe('Wolfgang Warsch');
            expect(reviews).toBeSorted({key: 'designer',
            descending: true});
        })
    });

    test('server responds with review object ordered in ascending order', () =>
    {
        return request(app)
        .get('/api/reviews?order=asc')
        .expect(200)
        .then((response) =>
        {
            const { reviews } = response.body;
            expect(reviews).toBeSortedBy('created_at',
            { ascending: true });
        })
    });

    test('server responds with review object for a given sort_by and order', () =>
    {
        return request(app)
        .get('/api/reviews?sort_by=designer&order=asc')
        .expect(200)
        .then((response) =>
        {
            const { reviews } = response.body;
            expect(reviews[0].designer).toBe('Akihisa Okui');
            expect(reviews).toBeSortedBy('designer',
            { ascending: true });
        })
    });

    test('server responds with review object for a given category, sort_by and order', () =>
    {
        return request(app)
        .get('/api/reviews?category=social deduction&sort_by=title&order=asc')
        .expect(200)
        .then((response) =>
        {
            const { reviews } = response.body;
            expect(reviews[0].title).toBe('A truly Quacking Game; Quacks of Quedlinburg');
            expect(reviews).toBeSortedBy('title',
            { ascending: true });
        })
    });

    describe('Errors', () =>
    {
        test('404 - invalid category value provided', () =>
        {
            return request(app)
            .get('/api/reviews?category=mariogames')
            .expect(404)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('category not found!');
            });
        });

        test('400 - invalid order query provided', () =>
        {
            return request(app)
            .get('/api/reviews?order=abcdef')
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid order query!');
            });
        });

        test('400 - invalid sort query provided', () =>
        {
            return request(app)
            .get('/api/reviews?sort_by=abcdef')
            .expect(400)
            .then((response) =>
            {
                const { message } = response.body;
                expect(message).toBe('Invalid sort query!');
            });
        });
    });
});

describe('GET /api/reviews/:review_id (comment_count)', () =>
{
    test('server responds with 200 OK and a review response object with comment_count property', () =>
    {
        return request(app)
        .get('/api/reviews/3')
        .expect(200)
        .then((response) =>
        {
            const { review } = response.body;

            expect(review).toHaveLength(1);

            expect(review[0]).toHaveProperty('comment_count');
            expect(parseInt(review[0].comment_count)).toBe(3);
        });
    });

    test('server responds with comment_count = 0, if no comments are present in comments table', () =>
    {
        return request(app)
        .get('/api/reviews/5')
        .expect(200)
        .then((response) =>
        {
            const { review } = response.body;

            expect(review).toHaveLength(1);

            expect(parseInt(review[0].comment_count)).toBe(0);
        });
    });
});