const dotenv = require('dotenv');

dotenv.config();
const { MONGODB_URI, MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

const config = {
  mongodb: {
    url: MONGODB_URI,
    databaseName: 'noteworthy',

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: MONGODB_USERNAME,
      password: MONGODB_PASSWORD
    }
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false
};

// Return the config as a promise
module.exports = config;
