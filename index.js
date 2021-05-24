import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import { buildContext } from 'graphql-passport';
import mongoose from 'mongoose';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import passport from './passport/passport';

dotenv.config();
const { MONGODB_URI, SESSION_SECRET } = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// NOTE: To drop the entire database
// .then(conn => mongoose.connection.db.dropDatabase());

const PORT = 4300;

// TODO: Setup CORS policy to match deployed frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
};

const app = express();

// TODO: Recheck the arguments here
const sessionConfig = {
  genid: req => uuidv4(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
};

if (app.get('env') === 'production') {
  // app.set('trust proxy', 1) // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => buildContext({ req, res }),
  playground: {
    settings: {
      'request.credentials': 'same-origin'
    }
  }
});

server.applyMiddleware({ app, cors: corsOptions });

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`));
