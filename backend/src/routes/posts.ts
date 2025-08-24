import { Router, type Request, type Response } from "express";
import { loggedin } from "../middlewares/session.js";
import { Types } from "mongoose";
import Post, { MIN_RANGE, MAX_RANGE } from "../db/models/post.js";

const postsrouter = Router();

postsrouter.use(loggedin);

postsrouter.get('/', async (req: Request, res: Response) => {
  if (!req.params.begin) {
    return res.status(400).send({msg: "'begin' parameter missing"});
  }
  if (!req.params.orderBy) {
    return res.status(400).send({msg: "'orderBy' parameter missing"});
  }
  let begin = parseInt(req.params.begin);
  let {orderBy, filterSubjects, filterYears, filterState, priceMin, priceMax} = req.params;
  if (!(filterState && filterSubjects && filterYears)) {
    return res.status(400).send({msg: "'filter*' parameter/s missing"});
  }
  let dbmin = (priceMin) ? parseInt(priceMin) : MIN_RANGE;
  let dbmax = (priceMax) ? parseInt(priceMax) : MAX_RANGE;
  let dbsort: {[key: string]: 1 | -1} = (orderBy === 'price') ? { 'Price.Min': 1 } : { 'CreatedAt': -1 };

  let posts = await Post.find({ Subjects: { $in: filterSubjects }, Years: { $in: filterYears }, State: { $in: filterState }, 'Price.Min': { $lte: dbmax }, 'Price.Max': { $gte: dbmin } })
                    .sort(dbsort)
                    .skip(begin)
                    .limit(10);
  
  return res.status(200).send({posts: posts});
});

postsrouter.post('/', async (req: Request, res: Response) => {
  
});

postsrouter.delete('/', async (req: Request, res: Response) => {
  
});


export default postsrouter;
