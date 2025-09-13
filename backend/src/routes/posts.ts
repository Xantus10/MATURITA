import { Router, type Request, type Response } from "express";
import { checkRole, loggedin } from "../middlewares/session.js";
import { Types } from "mongoose";
import Post, { MIN_RANGE, MAX_RANGE } from "../db/models/post.js";
import { strQueryToArray } from "../util/parse.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import fs from "node:fs";

const postsrouter = Router();

postsrouter.use(loggedin);

postsrouter.get('/', async (req: Request, res: Response) => {
  if (!req.query.begin) {
    return res.status(400).send({msg: "'begin' parameter missing"});
  }
  if (!req.query.orderBy) {
    return res.status(400).send({msg: "'orderBy' parameter missing"});
  }
  let begin = parseInt(req.query.begin as string);
  let {orderBy, filterSubjects, filterYears, filterState, priceMin, priceMax} = req.query;
  if (!(filterState && filterSubjects && filterYears)) {
    return res.status(400).send({msg: "'filter*' parameter/s missing"});
  }

  let dbstates = strQueryToArray(filterState as string);
  let dbsubjects = strQueryToArray(filterSubjects as string);
  let dbyears = strQueryToArray<Number>(filterYears as string, parseInt);
  
  let dbmin = (priceMin) ? parseInt(priceMin as string) : MIN_RANGE;
  let dbmax = (priceMax) ? parseInt(priceMax as string) : MAX_RANGE;
  let dbsort: {[key: string]: 1 | -1} = (orderBy === 'price') ? { 'Price.Min': 1 } : { 'CreatedAt': -1 };

  let posts = await Post.find({ Subjects: { $in: dbsubjects }, Years: { $in: dbyears }, State: { $in: dbstates }, 'Price.Min': { $lte: dbmax }, 'Price.Max': { $gte: dbmin } })
                    .sort(dbsort)
                    .skip(begin)
                    .limit(10);

  return res.status(200).send({posts: posts});
});


const photosDir = path.join(import.meta.dirname, '../../images');

if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, {recursive: true});
}

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

  limits: { fileSize: 5 * 1024 * 1024 }
});

postsrouter.post('/', checkRole('user'), multerMiddleware.array('pictures', 3), async (req: Request, res: Response) => {
  let {title, remove, subjects, state, years, priceMin, priceMax} = req.body;
  if (!(title && remove && subjects && state && years && priceMin)) {
    return res.status(400).send({msg: "Required parameter/s missing"});
  }
  let min = parseInt(priceMin);
  let max = (priceMax) ? parseInt(priceMax) : min;
  let subsArr = strQueryToArray(subjects as string);
  let yearsArr = strQueryToArray(years as string, parseInt);
  let photos = (req.files) ? (req.files as Express.Multer.File[]).map(file => file.filename) : [];
  await Post.create({ CreatorId: req.session.data?.objId, Title: title, RemoveAt: parseInt(remove), Subjects: subsArr, State: state, Years: yearsArr, Price: { Min: min, Max: max }, Photos: photos });
  return res.status(201).send({msg: "Post created"});
});

postsrouter.delete('/', async (req: Request, res: Response) => {
  if (!req.body.postId) {
    return res.status(400).send({msg: "'postId' parameter/s missing"});
  }
  let postId = new Types.ObjectId(req.body.postId as string);
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send({msg: "Post does not exist!"});
  }
  if (!(req.session.data?.role === 'admin' || req.session.data?.objId.equals(post.CreatorId))) {
    return res.status(403).send({msg: "Unauthorized (not admin nor creator)!"});
  }
  await post.deleteOne();
  return res.status(200).send({msg: 'Post deleted'});
});

postsrouter.post('/extend', checkRole('user'), async (req: Request, res: Response) => {
  if (!req.body.postId) {
    return res.status(400).send({msg: "'postId' parameter/s missing"});
  }
  if (!req.body.days) {
    return res.status(400).send({msg: "'days' parameter/s missing"});
  }
  let postId = new Types.ObjectId(req.body.postId as string);
  let days = parseInt(req.body.days);
  if (days > 30) {
    return res.status(400).send({msg: "You cannot extend more than 30 days"});
  }
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send({msg: "Post does not exist!"});
  }
  if (!(post.CreatorId.equals(req.session.data?.objId))) {
    return res.status(403).send({msg: "Unauthorized (not creator)!"});
  }
  Post.extendRemoveAt(postId, new Date(post.RemoveAt.getTime() + days*1000*86400));
  return res.status(200).send({msg: `Posts lifetime has been extended by ${days} days`});
});

postsrouter.get('/user', async (req: Request, res: Response) => {
  if (req.query.userId && req.session.data?.role !== "admin") {
    return res.status(403).send({msg: "Unauthorized (not admin)!"});
  }
  let userId = (req.query.userId) ? new Types.ObjectId(req.query.userId as string) : req.session.data?.objId;
  let posts = await Post.find({ CreatorId: userId });
  return res.status(200).send({posts: posts});
});

export default postsrouter;
