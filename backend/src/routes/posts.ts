/**
 * File: posts.ts
 * Purpose: Any posts related routes
 */

import { Router, type NextFunction, type Request, type Response } from "express";
import { checkRole, loggedin } from "../middlewares/session.js";
import { Types } from "mongoose";
import Post, { MIN_RANGE, MAX_RANGE } from "../db/models/post.js";
import { parseArray } from "../util/parse.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import fs from "node:fs";

const postsrouter = Router();

// User must be logged in
postsrouter.use(loggedin);

/**
 * Return a list of all posts matching the filters
 */
postsrouter.get('/', async (req: Request, res: Response) => {
  if (!req.query.begin) {
    return res.status(400).send({msg: "post.4.1"});
  }
  if (!req.query.orderBy) {
    return res.status(400).send({msg: "post.4.2"});
  }
  let begin = parseInt(req.query.begin as string);
  let {orderBy, filterSubjects, filterYears, filterState, priceMin, priceMax} = req.query;
  if (!(filterState && filterSubjects && filterYears)) {
    return res.status(400).send({msg: "post.4.6"});
  }

  let dbyears = parseArray<Number>(filterYears as string[], parseInt);
  
  let dbmin = (priceMin) ? parseInt(priceMin as string) : MIN_RANGE;
  let dbmax = (priceMax) ? parseInt(priceMax as string) : MAX_RANGE;
  let dbsort: {[key: string]: 1 | -1} = (orderBy === 'price') ? { 'Price.Min': 1 } : { 'CreatedAt': -1 };

  let posts = await Post.find({ Subjects: { $in: filterSubjects }, Years: { $in: dbyears }, State: { $in: filterState }, 'Price.Min': { $lte: dbmax }, 'Price.Max': { $gte: dbmin } })
                    .sort(dbsort)
                    .skip(begin)
                    .limit(10);

  return res.status(200).send({posts: posts});
});

/**
 * Path to the photos directory
 */
const photosDir = path.join(import.meta.dirname, '../../images');

// Create the photos directory if it does not exist
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, {recursive: true});
}

/**
 * Settings for multer (File upload handler)
 */
const multerMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, photosDir);
    },
    filename: (req, file, callback) => {
      callback(null, uuidv4() + path.extname(file.originalname));
    }
  }),

  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },

  limits: { fileSize: 10 * 1024 * 1024 }
});

const multerErrHandling = (req: Request, res: Response, next: NextFunction) => {
  multerMiddleware.array('pictures', 3)(req, res, (err) => {
    if (err) return res.status(400).send({msg: "post.4.7"});
    next();
  });
};

/**
 * Create a new post
 */
postsrouter.post('/', checkRole('user'), multerMiddleware.array('pictures', 3), async (req: Request, res: Response) => {
  let {title, remove, subjects, state, years, priceMin, priceMax} = req.body;
  if (!(title && remove && subjects && state && years && priceMin)) {
    return res.status(400).send({msg: "std.4.0"});
  }
  let min = parseInt(priceMin);
  let max = (priceMax) ? parseInt(priceMax) : min;
  let yearsArr = parseArray(years as string[], parseInt);
  let photos = (req.files) ? (req.files as Express.Multer.File[]).map(file => file.filename) : [];
  await Post.create({ CreatorId: req.session.data?.objId, Title: title, RemoveAt: parseInt(remove), Subjects: subjects, State: state, Years: yearsArr, Price: { Min: min, Max: max }, Photos: photos });
  return res.status(201).send({msg: "post.2.0"});
});

/**
 * Remove a post
 */
postsrouter.delete('/', async (req: Request, res: Response) => {
  if (!req.body.postId) {
    return res.status(400).send({msg: "post.4.2"});
  }
  let postId = new Types.ObjectId(req.body.postId as string);
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send({msg: "post.4.4"});
  }
  if (!(req.session.data?.role === 'admin' || req.session.data?.objId.equals(post.CreatorId))) {
    return res.status(403).send({msg: "std.4.7"});
  }
  await post.deleteOne();
  return res.status(200).send({msg: 'post.2.1'});
});

/**
 * Extend a posts lifespan
 */
postsrouter.post('/extend', checkRole('user'), async (req: Request, res: Response) => {
  if (!req.body.postId) {
    return res.status(400).send({msg: "post.4.2"});
  }
  if (!req.body.days) {
    return res.status(400).send({msg: "post.4.3"});
  }
  let postId = new Types.ObjectId(req.body.postId as string);
  let days = parseInt(req.body.days);
  if (days > 30) {
    return res.status(400).send({msg: "post.4.5"});
  }
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send({msg: "post.4.4"});
  }
  if (!(post.CreatorId.equals(req.session.data?.objId))) {
    return res.status(403).send({msg: "std.4.6"});
  }
  await Post.extendRemoveAt(postId, new Date(post.RemoveAt.getTime() + days*1000*86400));
  return res.status(200).send({msg: 'post.2.3'});
});

/**
 * Get all posts for a user
 */
postsrouter.get('/user', async (req: Request, res: Response) => {
  if (req.query.userId && req.session.data?.role !== "admin") {
    return res.status(403).send({msg: "std.4.5"});
  }
  let userId = (req.query.userId) ? new Types.ObjectId(req.query.userId as string) : req.session.data?.objId;
  let posts = await Post.find({ CreatorId: userId });
  return res.status(200).send({posts: posts});
});

/**
 * Delete all posts for a user
 */
postsrouter.delete('/user', checkRole('admin'), async (req: Request, res: Response) => {
  if (!req.body.userId) return res.status(400).send({msg: "std.4.0"});
  let userId = new Types.ObjectId(req.body.userId as string);
  await Post.removeByCreatorId(userId);
  return res.status(200).send({msg: "post.2.1"});
});

/**
 * Add additional info to post
 */
postsrouter.post('/addinfo', async (req: Request, res: Response) => {
  if (!req.body.postId) return res.status(400).send({msg: "post.4.2"});
  if (!req.body.msg) return res.status(400).send({msg: "std.4.0"});

  let postId = new Types.ObjectId(req.body.postId as string);
  let msg = req.body.msg;

  let post = await Post.findById(postId);

  if (!post) {
    return res.status(404).send({msg: "post.4.4"});
  }
  if (!(post.CreatorId.equals(req.session.data?.objId))) {
    return res.status(403).send({msg: "std.4.6"});
  }

  await Post.addInfo(postId, msg);

  return res.status(201).send({msg: "std.2.0"});
});

export default postsrouter;
