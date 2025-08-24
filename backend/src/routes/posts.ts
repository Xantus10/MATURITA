import { Router, type Request, type Response } from "express";
import { loggedin } from "../middlewares/session.js";
import { Types } from "mongoose";
import Post, { MIN_RANGE, MAX_RANGE } from "../db/models/post.js";

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
  let dbmin = (priceMin) ? parseInt(priceMin as string) : MIN_RANGE;
  let dbmax = (priceMax) ? parseInt(priceMax as string) : MAX_RANGE;
  let dbsort: {[key: string]: 1 | -1} = (orderBy === 'price') ? { 'Price.Min': 1 } : { 'CreatedAt': -1 };

  let posts = await Post.find({ Subjects: { $in: filterSubjects }, Years: { $in: filterYears }, State: { $in: filterState }, 'Price.Min': { $lte: dbmax }, 'Price.Max': { $gte: dbmin } })
                    .sort(dbsort)
                    .skip(begin)
                    .limit(10);
  
  return res.status(200).send({posts: posts});
});

postsrouter.post('/', async (req: Request, res: Response) => {
  if (req.session.data?.role !== 'user') {
    return res.status(403).send({msg: "Unauthorized (not user)!"});
  }
  let {title, remove, subjects, state, years, priceMin, priceMax} = req.body;
  if (!(title && remove && subjects && state && years && priceMin)) {
    return res.status(400).send({msg: "Required parameter/s missing"});
  }
  let min = parseInt(priceMin);
  let max = (priceMax) ? parseInt(priceMax) : min;
  let yearsArr = years.map(parseInt);
  await Post.create({ CreatorId: req.session.data?.objId, Title: title, RemoveAt: parseInt(remove), Subjects: subjects, State: state, Years: yearsArr, Price: { Min: min, Max: max } });
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
  if (!(req.session.data?.role === 'admin' || req.session.data?.objId === post._id)) {
    return res.status(403).send({msg: "Unauthorized (not admin nor creator)!"});
  }
  await post.deleteOne();
});


export default postsrouter;
