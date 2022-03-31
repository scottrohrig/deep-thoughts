const path = require( 'path' );
const express = require( 'express' );
const { ApolloServer } = require( 'apollo-server-express' );
const { ApolloServerPluginLandingPageDisabled } = require( 'apollo-server-core' );

const { typeDefs, resolvers } = require( './schemas' );
const { authMiddleware } = require( './utils/auth' );
const db = require( './config/connection' );

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in schema data
  const server = new ApolloServer( {
    typeDefs,
    resolvers,
    // authMiddleware is not defined...
    context: authMiddleware,
    plugins: [
      //       {
      //         async serverWillStart() {
      //           return {
      //             async renderLandingPage() {
      //               const html = `
      // <!DOCTYPE html>
      // <html lang="en">
      // <head>
      //   <meta charset="UTF-8">
      //   <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //   <title>Document</title>
      // </head>
      // <body>
      //   <h1><a href="https://studio.apollographql.com/sandbox/explorer">Sandbox</a></h1>
      // </body>
      // </html>`;
      //               return { html };
      //             }
      //           };
      //         }
      //       },
      // ApolloServerPluginLandingPageDisabled()
    ]
  }
  );

  // start the apollo server
  await server.start();

  // integrate with Express app
  server.applyMiddleware( { app } );

  // log where to test GQL API
  console.log( `Use GraphQL at http://localhost:${ PORT }${ server.graphqlPath }` );
};

// initialize apollo server
startServer();

app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

// serve up static assets\
if ( process.env.NODE_ENV === 'production' ) {
  app.use( express.static( path.joing( __dirname, '../client/build' ) ) );
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

db.once( 'open', () => {
  app.listen( PORT, () => {
    console.log( `API server running on port ${ PORT }!` );
  } );
} );
