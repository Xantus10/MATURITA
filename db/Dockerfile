FROM mongo:latest

COPY init.sh /docker-entrypoint-initdb.d/init.sh
COPY create.js /docker-entrypoint-initdb.d/create.js

EXPOSE 27017