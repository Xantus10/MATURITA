const DB_NAME = 'maturita';

const MIN_RANGE = 0;
const MAX_RANGE = 1000;

const db = new Mongo().getDB(DB_NAME);

// Create collections
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'MicrosoftId',
        'Name',
        'Role',
        'LastLogin',
        'Bans',
        'Socials'
      ],
      properties: {
        MicrosoftId: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },

        Name: {
          bsonType: 'object',
          required: ['First', 'Last'],
          properties: {
            First: { bsonType: 'string' },
            Last: { bsonType: 'string' }
          }
        },

        Role: {
          bsonType: 'string',
          enum: ['user', 'admin'],
          description: 'must be \'user\' or \'admin\''
        },

        LastLogin: {
          bsonType: 'date',
          description: 'must be a date'
        },

        Bans: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['CreatedAt', 'Until', 'IssuedBy', 'Reason'],
            properties: {
              CreatedAt: { bsonType: 'date' },
              Until: { bsonType: 'date' },
              IssuedBy: { bsonType: 'objectId' },
              Reason: { bsonType: 'string' }
            }
          }
        },

        Socials: {
          bsonType: 'object',
          properties: {
            Email: { bsonType: 'string' },
            Phone: { bsonType: 'string' },
            Instagram: { bsonType: 'string' },
            Discord: { bsonType: 'string' }
          }
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'MicrosoftId',
        'Name'
      ],
      properties: {
        MicrosoftId: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },

        Name: {
          bsonType: 'object',
          required: ['First', 'Last'],
          properties: {
            First: { bsonType: 'string' },
            Last: { bsonType: 'string' }
          }
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});


db.createCollection('posts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'CreatorId',
        'Title',
        'CreatedAt',
        'RemoveAt',
        'Subjects',
        'State',
        'Years',
        'Price',
        'Photos',
        'AddInfo'
      ],
      properties: {
        CreatorId: {
          bsonType: 'objectId',
          description: 'must be an ObjectId referencing a User'
        },

        Title: {
          bsonType: 'string',
          description: 'must be a string'
        },

        CreatedAt: {
          bsonType: 'date',
          description: 'must be a date'
        },

        RemoveAt: {
          bsonType: 'date',
          description: 'must be a date'
        },

        Subjects: {
          bsonType: 'array',
          minItems: 1,
          items: { bsonType: 'string' },
          description: 'must be a non-empty array of strings'
        },

        State: {
          bsonType: 'string',
          enum: ['Like new', 'Good', 'Worn'],
          description: 'must be one of the allowed states'
        },

        Years: {
          bsonType: 'array',
          minItems: 1,
          items: { bsonType: 'int' },
          description: 'must be a non-empty array of numbers'
        },

        Price: {
          bsonType: 'object',
          required: ['Min', 'Max'],
          properties: {
            Min: {
              bsonType: 'number',
              minimum: MIN_RANGE,
              maximum: MAX_RANGE
            },
            Max: {
              bsonType: 'number',
              minimum: MIN_RANGE,
              maximum: MAX_RANGE
            }
          }
        },

        Photos: {
          bsonType: 'array',
          minItems: 1,
          items: { bsonType: 'string' },
          description: 'must be a non-empty array of strings'
        },

        AddInfo: {
          bsonType: 'array',
          minItems: 1,
          items: { bsonType: 'string' },
          description: 'must be a non-empty array of strings'
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});


db.createCollection('subjects', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'Subject'
      ],
      properties: {
        Subject: {
          bsonType: 'string',
          description: 'must be a string'
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});


db.createCollection('blacklists', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['MicrosoftId'],
      properties: {
        MicrosoftId: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },

        CreatedAt: {
          bsonType: 'date',
          description: 'must be a date'
        },

        Reason: {
          bsonType: 'string',
          description: 'must be a string'
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});


db.createCollection('messages', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['Sender', 'Title', 'Content'],
      properties: {
        Sender: {
          bsonType: 'objectId',
          description: 'must be an ObjectId referencing a User'
        },

        TargetUser: {
          bsonType: 'objectId',
          description: 'must be an ObjectId if provided'
        },

        TargetGroup: {
          bsonType: 'string',
          enum: ['admin', 'all'],
          description: 'must be either \'admin\' or \'all\' if provided'
        },

        SentAt: {
          bsonType: 'date',
          description: 'must be a date'
        },

        Title: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },

        Content: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});



// Create indexes
db.users.createIndex({MicrosoftId: 1}, {unique: true});
db.users.createIndex({LastLogin: 1}, {expireAfterSeconds: 38880000});
db.posts.createIndex({RemoveAt: 1}, {expireAfterSeconds: 1});
db.subjects.createIndex({Subject: 1}, {unique: true});
db.blacklists.createIndex({MicrosoftId: 1}, {unique: true});
db.messages.createIndex({SentAt: 1}, {expireAfterSeconds: 1209600});

