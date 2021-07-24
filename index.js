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
const {
  CORS_ORIGIN,
  MONGODB_URI,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  SESSION_SECRET
} = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: MONGODB_USERNAME,
  pass: MONGODB_PASSWORD
});
// NOTE: To drop the entire database
// .then(conn => mongoose.connection.db.dropDatabase());

const PORT = process.env.PORT || 4300;

// TODO: Setup CORS policy to match deployed frontend
const corsOptions = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true
};

const app = express();

app.use(function (req, res, next) {
  setTimeout(next, 1000);
});

// TODO: Recheck the arguments here
const sessionConfig = {
  genid: req => uuidv4(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie = {
    // serve secure cookies
    secure: true,
    sameSite: 'none'
  };
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
      'request.credentials': 'same-origin',
      'editor.theme': 'light'
    }
  }
});

server.applyMiddleware({ app, cors: corsOptions });

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`));
