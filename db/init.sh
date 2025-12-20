#!/bin/bash

# Set default values for MongoDB credentials (if not set through environment variables)
DB_NAME=${DB_NAME:-maturita}
MONGO_USER=${MONGO_USER:-dbuser}
MONGO_PASSWORD=${MONGO_PASSWORD:-dbpass}

# Create the MongoDB user
mongosh -u "${MONGO_INITDB_ROOT_USERNAME}" -p "${MONGO_INITDB_ROOT_PASSWORD}" <<EOF
use ${DB_NAME}
db.createUser({
  user: "${MONGO_USER}",
  pwd: "${MONGO_PASSWORD}",
  roles: [{role: "readWrite", db: "${DB_NAME}"}]
});
EOF

# Now, load the .js
mongosh -u "${MONGO_USER}" -p "${MONGO_PASSWORD}" $DB_NAME /docker-entrypoint-initdb.d/create.js
