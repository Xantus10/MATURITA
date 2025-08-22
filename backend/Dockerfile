FROM node:24

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENV MONGODB_URI='mongodb://dbuser:be68DFG##3223.U@127.0.0.1:27017/DB_NAME_HERE'
ENV MICROSOFT_ISSUER_URL='https://login.microsoftonline.com/986a3974-67bd-4338-af77-835ff0f8b550/v2.0'
ENV PORT=5000


EXPOSE 5000
