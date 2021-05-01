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
