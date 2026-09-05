const request = require('supertest');
const express = require('express');
const db = require('../config/database');
const urlRoutes = require('../routes/urlRoutes');
const redirectRoutes = require('../routes/redirectRoutes');

const app = express();
app.use(express.json());
app.use('/api', urlRoutes);

// Include redirect routes for testing
app.use('/', redirectRoutes);

// Clear database before each test
beforeEach((done) => {
  db.run('DELETE FROM url_clicks', () => {
    db.run('DELETE FROM urls', done);
  });
});

afterAll((done) => {
  db.close(done);
});

describe('POST /api/shorten', () => {
  it('should create a short URL with valid input', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({
        originalUrl: 'https://example.com/test',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.shortUrl).toBeDefined();
    expect(res.body.data.originalUrl).toBe('https://example.com/test');
  });

  it('should reject invalid URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({
        originalUrl: 'not-a-url',
      })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it('should create a custom alias', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({
        originalUrl: 'https://example.com/custom',
        customAlias: 'mycustomalias',
      })
      .expect(201);

    expect(res.body.data.shortCode).toBe('mycustomalias');
  });

  it('should reject duplicate custom alias', async () => {
    // First creation
    await request(app)
      .post('/api/shorten')
      .send({
        originalUrl: 'https://example.com/first',
        customAlias: 'takenalias',
      })
      .expect(201);

    // Duplicate attempt
    const res = await request(app)
      .post('/api/shorten')
      .send({
        originalUrl: 'https://example.com/second',
        customAlias: 'takenalias',
      })
      .expect(409);

    expect(res.body.success).toBe(false);
  });

  it('should reject missing originalUrl', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/url/:shortCode', () => {
  it('should return URL details', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com/details-test' });
    
    const shortCode = createRes.body.data.shortCode;

    const res = await request(app)
      .get(`/api/url/${shortCode}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.originalUrl).toBe('https://example.com/details-test');
    expect(res.body.data.shortCode).toBe(shortCode);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app)
      .get('/api/url/nonexistent123')
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/analytics/:shortCode', () => {
  it('should return analytics for valid short code', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com/analytics-test' });
    
    const shortCode = createRes.body.data.shortCode;

    const res = await request(app)
      .get(`/api/analytics/${shortCode}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.clickCount).toBeDefined();
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app)
      .get('/api/analytics/nonexistent456')
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe('GET /:shortCode (Redirect)', () => {
  it('should redirect to original URL', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com/redirect-test' });
    
    const shortCode = createRes.body.data.shortCode;

    const res = await request(app)
      .get(`/${shortCode}`)
      .expect(302);

    expect(res.header.location).toBe('https://example.com/redirect-test');
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app)
      .get('/nonexistent789')
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/url/:shortCode', () => {
  it('should deactivate a URL', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ originalUrl: 'https://example.com/delete-test' });
    
    const shortCode = createRes.body.data.shortCode;

    const res = await request(app)
      .delete(`/api/url/${shortCode}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent short code', async () => {
    const res = await request(app)
      .delete('/api/url/nonexistent999')
      .expect(404);

    expect(res.body.success).toBe(false);
  });
});
