import cors from 'cors';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import schema from './schema';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/noteworthy_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// TODO: Check if nodemon has to be a main dependency
const app = express();
const PORT = 4300;

// TODO: Handle authentication

// TODO: Setup CORS policy to match deployed frontend
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Notetaking API v1'
  });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
