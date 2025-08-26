import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import env from './config/envconfig.js';

const app = express();

app.use(express.json());

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

app.use('/auth', authrouter);
app.use('/posts', postsrouter);

app.listen(env.PORT, () => {
  console.log(`Server is running at localhost:${env.PORT}`);
});
