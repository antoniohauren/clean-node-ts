import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'my_name',
        email: 'my_email@mail.com',
        password: '123',
        passwordConfirm: '123'
      })
      .expect(200)
  })
})
