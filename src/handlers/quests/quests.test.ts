import request from 'supertest';
import app from '../../app';

describe('GET /quests', () => {
  it('gets list of active quests', async () => {
    const response = await request(app)
      .get('/api/quests')
      .set(
        'Authorization',
        'Bearer e00sl5xsl3psiw8oq1cg589eux3qioodph7xeyex89awschwsem8lwv5c4y3946gzbka2bheug8ox3c5wjtjmacufep7fvjkglxkf02f6g9'
      );

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text).data[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      type: expect.any(String),
      description: expect.any(String),
    });
  });

  it('fails auth to get quests', async () => {
    const response = await request(app).get('/api/quests');

    expect(response.status).toEqual(401);
  });
});
