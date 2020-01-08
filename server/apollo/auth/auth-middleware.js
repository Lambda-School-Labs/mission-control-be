const OktaJwtVerifier = require('@okta/jwt-verifier');

// Configure OKTA client
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-601359.okta.com/oauth2/default',
  clientId: '0oa2bh68ejiDpKNBD357',
  assertClaims: {
    aud: 'api://default',
  },
});

module.exports = req => {
  const authHeader = req.authorization;
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    throw new Error('Whoops');
  }

  // Extract pure token, stripped of 'Bearer '
  const accessToken = match[1];

  // Verify audience from client config
  const expectedAudience = 'api://default';

  return (
    oktaJwtVerifier
      // Validate that token is in the audience
      // Configured via OKTA dashboard for broader audiences
      .verifyAccessToken(accessToken, expectedAudience)
      .then(jwt => {
        const claims = jwt.claims.Auth;
        const id = jwt.claims.uid;
        return {
          id,
          claims,
        };
      })
      .catch(err => {
        throw new Error(err);
      })
  );
};