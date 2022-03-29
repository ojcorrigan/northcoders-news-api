const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('getTopics', () => {
  test('200: /api/topics responds with an object with key topics and an array', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Object);
      });
  });
  test('200 /api/topics responds with an array of topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics).toEqual([
          {
            description: 'The man, the Mitch, the legend',
            slug: 'mitch',
          },
          {
            description: 'Not dogs',
            slug: 'cats',
          },
          {
            description: 'what books are made of',
            slug: 'paper',
          },
        ]);
      });
  });
  test('/api/topic responds 404 not found', () => {
    return request(app)
      .get('/api/topic')
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('invalid path');
      });
  });
});


describe('getArticleById', () => {
  test('200 GET /api/articles/2 responds with obeject with correct key values', () => {
    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then((result) => {
        expect(result.body).toBeInstanceOf(Object);
        expect(result.body).toMatchObject({
          author: 'icellusedkars',
          title: expect.any(String),
          article_id: 2,
          body: expect.any(String),
          topic: 'mitch',
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test('404: GET /api/articles/9999999 responds with Article not found', () => {
    return request(app)
      .get('/api/articles/9999999')
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('Article not found');
      });
  });
  test('400: GET /api/articles/ABD responds with bad request invalid article_id', () => {
    return request(app)
      .get('/api/articles/ABD')
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe('Bad request, invalid article_id');
      })
    })
  })
describe('getUsers', () => {
  test('200: /api/users responds with an array', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
  test('200 /api/topics responds with an array of users, formatted correctly', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(
          res.body.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
            });
          })
        );
      });
  });
  test('/api/userr responds 404 not found', () => {
    return request(app)
      .get('/api/userr')
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe('invalid path');
      });
  });
});


describe('patchArticleById', () => {
  test('202 Patch /api/articles/:article_id successfully updates vote count', () => {
    return request(app)
    .patch('/api/articles/2')
    .send({inc_votes: 5})
    .expect(202)
    .then((result) => {
      expect(result.body).toMatchObject({
        author: 'icellusedkars',
        title: expect.any(String),
        article_id: 2,
        body: expect.any(String),
        topic: 'mitch',
        created_at: expect.any(String),
        votes: 5,
      });
    })
  })
  test('202 Patch /api/articles/:article_id successfully updates vote count down', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: -5})
    .expect(202)
    .then((result) => {
      expect(result.body).toMatchObject({
        author: 'butter_bridge',
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: 'mitch',
        created_at: expect.any(String),
        votes: 95,
      });
    })
  })
  test('202 Patch /api/articles/:article_id successfully updates vote count down below 0', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: -105})
    .expect(202)
    .then((result) => {
      expect(result.body).toMatchObject({
        author: 'butter_bridge',
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: 'mitch',
        created_at: expect.any(String),
        votes: -5,
      });
    })
  })
  test('400 Patch /api/articles/:article_id invalid input for send', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: 'abc'})
    .expect(400)
  })
  test('400 Patch /api/articles/:article_id invalid input for send', () => {
    return request(app)
    .patch('/api/articles/1')
    .send('7')
    .expect(400)
  })
  test('404 Patch /api/articles/:article_id author not found', () => {
    return request(app)
    .patch('/api/articles/1000000')
    .send({inc_votes: -105})
    .expect(404)
  })
})