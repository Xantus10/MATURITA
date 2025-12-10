const DB_NAME = 'Maturita';

const db = new Mongo().getDB(DB_NAME);

// Create collections
db.createCollection('users');
db.createCollection('posts');
db.createCollection('subjects');
db.createCollection('blacklists');

// Create indexes
db.users.createIndex({MicrosoftId: 1}, {unique: true});
db.users.createIndex({LastLogin: 1}, {expireAfterSeconds: 38880000});
db.posts.createIndex({RemoveAt: 1}, {expireAfterSeconds: 1});
db.subjects.createIndex({Subject: 1}, {unique: true});
db.blacklists.createIndex({MicrosoftId: 1}, {unique: true});

