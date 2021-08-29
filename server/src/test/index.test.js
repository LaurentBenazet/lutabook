const request = require('supertest')
const server = require('../app.js')
const mongoose = require("mongoose");

describe('Get', () => {
  it('Should get the api', async () => {
    const res = await request(server)
      .get('/api')
      .send({
        userId: 1,
        title: 'test is cool',
      })
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Hello from server!');
  })
})
afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  await mongoose.connection.close();
});