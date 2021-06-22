module.exports = {
  async up(db, client) {
    const databases = await db.collection('databases').find({}).toArray();
    const operations = databases.map(database => {
      return db
        .collection('categories')
        .insertOne({
          name: 'Non-categorised',
          notes: database.notes,
          databaseId: database._id
        })
        .then(res =>
          database.notes.map(noteid => {
            db.collection('notes').updateOne(
              { _id: noteid },
              { $set: { categoryId: res.ops[0]._id } }
            );
            db.collection('databases').updateOne(
              { _id: database._id },
              { $set: { categories: [res.ops[0]._id] } }
            );
          })
        );
    });
    return await Promise.all(operations);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
