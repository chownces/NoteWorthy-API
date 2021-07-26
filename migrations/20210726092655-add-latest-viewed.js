module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find({}).toArray();
    console.log(users);
    const operations = users.map(user => {
      if (user.databases[0]) {
        // User has existing databases
        return db
          .collection('users')
          .updateOne({ _id: user._id }, { $set: { lastVisited: user.databases[0] } });
      } else {
        return db
          .collection('databases')
          .insertOne({
            title: 'untitled',
            currentView: 'board',
            categories: [],
            notes: []
          })
          .then(res =>
            db
              .collection('users')
              .updateOne(
                { _id: user._id },
                { $set: { lastVisited: res.ops[0]._id, databases: [res.ops[0]._id] } }
              )
          );
      }
    });
    return await Promise.all(operations);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
