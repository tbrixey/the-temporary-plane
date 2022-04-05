import request from 'supertest';
import app from '../../app';

describe('GET /cities', () => {
  it('gets list of cities', async () => {
    const response = await request(app)
      .get('/api/class')
      .set(
        'Authorization',
        'Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9'
      );

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text).data[0]).toMatchObject({
      _id: expect.any(String),
      name: expect.any(String),
      bonus: expect.any(String),
      description: expect.any(String),
      speed: expect.any(Number),
      weight: expect.any(Number),
    });
  });

  it('fails auth to get cities', async () => {
    const response = await request(app).get('/api/class');

    expect(response.status).toEqual(401);
  });
});
