const DB_NAME = 'Maturita';

const COLLECTIONS = ['users', 'posts', 'subjects', 'blacklist'];


const db = new Mongo().getDB(DB_NAME);

// Setup user
db.createUser({user: 'dbuser', pwd: 'be68DFG##3223.U', roles: [{role: 'readWrite', db: DB_NAME}]});

// Create collections
for (let x in COLLECTIONS) {
  db.createCollection(x);
}

// Create indexes
db.users.createIndex({MicrosoftId: 1}, {unique: true});
db.users.createIndex({LastLogin: 1}, {expireAfterSeconds: 38880000});
db.posts.createIndex({RemoveAt: 1}, {expireAfterSeconds: 1});
db.subjects.createIndex({Subject: 1}, {unique: true});
db.blacklist.createIndex({MicrosoftId: 1}, {unique: true});

