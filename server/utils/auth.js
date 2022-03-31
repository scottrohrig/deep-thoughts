// import jwt
const jwt = require( 'jsonwebtoken' );

// create secret & expiration
const secret = 'myjwtubersecret';
const expiration = '2h';

// export the module with a function to signToken for the user object
module.exports = {
  signToken: function ( { username, email, _id } ) {
    const payload = { username, email, _id };

    return jwt.sign( { data: payload }, secret, { expiresIn: expiration } );
  },
  authMiddleware: function ( { req } ) {
    // define token (allowed from body, query, or headers)
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if ( req.headers.authorization ) {
      token = token
        .split( ' ' )
        .pop()
        .trim();
    }

    // if no token, return request
    if ( !token ) {
      return req;
    }

    // try to assign req.user the jwt data
    try {
      // attach user to req
      const { data } = jwt.verify( token, secret, { maxAge: expiration } );
      req.user = data;
    } catch {
      console.log( 'Invalid Token' );
    }

    // return request
    return req;
  }
};
