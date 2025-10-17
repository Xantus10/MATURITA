import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'node:path';

import env from './config/envconfig.js';


/**
 * The express main app
 */
const app = express();

app.use(express.json());

app.use('/images', express.static(path.join(import.meta.dirname, '../images')));

app.use(cookieParser());

app.set('trust proxy', 1); // Trust nginx

app.use(helmet({
  hsts: {maxAge: 0}, // Disable HSTS, because we communicate through nginx
  xssFilter: false   // Disable X-XSS-Protection - deprecated header
}));

import connect from './db/conn.js';
await connect();

/*
* Add custom middleware here
*/

import { Session } from './middlewares/session.js';
import { csrfMiddleware } from './middlewares/csrf.js';

app.use((req: Request, res: Response, next: NextFunction) => {Session.sessionParser(req, res, next)});

app.use(csrfMiddleware);


/*
* Add routes here
*/

import authrouter from './routes/auth.js';
import postsrouter from './routes/posts.js';
import usersrouter from './routes/users.js';
import blackrouter from './routes/blacklist.js';

app.use('/auth', authrouter);
app.use('/posts', postsrouter);
app.use('/users', usersrouter);
app.use('/blacklist', blackrouter);

app.listen(env.PORT, () => {
  console.log(`Server is running at localhost:${env.PORT}`);
});
