const app = require('supertest')(require('../app'));
const jwt = require('jwt-simple'); // jwt-simple does the encoding and decoding. all it needs is the user id and SECRET
const { expect } = require('chai');

describe('API', () => {

  // testing generating token with valid and invalid credentials
  describe('POST /api/tokens', () => {
    describe('with valid credentials', () => {
      it('returns a valid token', () => {
        const credentials = {
          username: 'Moe',
          password: 'moe'
        }; // valid credentials

        const token = jwt.encode({ id: 1 }, 'foobar'); // valid token
        return app.post('/api/tokens')
            .send(credentials)
            .expect(200)
            .then(result => {
              expect(result.body.token).to.equal(token);
            });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401', () => {
        const credentials = {
          username: 'Moe',
          password: 'oe' // invalid credentials
        };
        return app.post('/api/tokens')
          .send(credentials)
          .expect(401);
      });
    });
  });

  // what you can do with tokens, either send them as strings, or a nicer way, setting them up as headers when you make an axios request (can do it with supertest as well -- different syntax)
  describe('GET /api/me', () => {
    describe('with valid token', () => {
      it('returns the correct user', () => {
        const token = jwt.encode({ id: 1 }, 'foobar'); // valid token
        return app.get('/api/me')
          .set('auth', token) // this is where the header is set with supertest! called it auth header and send the token
          .expect(200)
          .then(result => {
            expect(result.body.favorite).to.equal('foo'); // since this is for Moe
          });
      });
    });

    describe('with invalid credentials', () => {
      it('returns a 401', () => {
        const token = jwt.encode({ id: 1 }, 'quq'); // invalid key
        return app.get('/api/me')
          .set('auth', token)
          .expect(401)
      });
    });
  });
});
