import request from 'supertest';
import app from '../../app';

describe('GET /race', () => {
  it('gets list of races', async () => {
    const response = await request(app)
      .get('/api/race')
      .set(
        'Authorization',
        'Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9'
      );

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text).data[0]).toMatchObject({
      _id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
    });
  });

  it('fails auth to get races', async () => {
    const response = await request(app).get('/api/race');

    expect(response.status).toEqual(401);
  });
});
