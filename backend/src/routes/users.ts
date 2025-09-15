import { Router, type Request, type Response } from "express";
import { loggedin, checkRole } from "../middlewares/session.js";
import { Types } from "mongoose";
import User from "../db/models/user.js";
import Post from "../db/models/post.js";

const usersrouter = Router();

usersrouter.use(loggedin);

usersrouter.get('/list', checkRole('admin'), async (req: Request, res: Response) => {
  let first = (req.query.first) ? req.query.first : "";
  let last = (req.query.last) ? req.query.last : "";
  let limit = (req.query.limit) ? parseInt(req.query.limit as string) : 20;
  let docs = await User.find({ "Name.First": { $regex: `^${first}.*$`, $options: 'i' }, "Name.Last": { $regex: `^${last}.*$`, $options: 'i' } }).limit(limit);
  return res.status(200).send({users: docs});
});


usersrouter.get('/me', async (req: Request, res: Response) => {
  let id = new Types.ObjectId(req.session.data?.objId);
  let doc = await User.findById(id, { Name: 1, Role: 1 });
  return res.status(200).send(doc);
});

usersrouter.delete('/me', async (req: Request, res: Response) => {
  let id = new Types.ObjectId(req.session.data?.objId);
  await Post.removeByCreatorId(id);
  await User.findByIdAndDelete(id);
  return res.status(200).send({msg: 'OK'});
});


usersrouter.get('/:id', async (req: Request, res: Response) => {
  let id = req.params.id;
  if (!id) return res.status(404).send({msg: 'The user does not exist'});
  if (!(/[0-9a-fA-F]{24}/.test(id))) return res.status(400).send({msg: 'The id is not valid mongodb id'});
  let doc = await User.findById(new Types.ObjectId(id), { Name: 1 });
  if (!doc) return res.status(404).send({msg: 'The user does not exist'});
  return res.status(200).send(doc);
});

usersrouter.delete('/:id', checkRole('admin'), async (req: Request, res: Response) => {
  let id = req.params.id;
  if (!id) return res.status(404).send({msg: 'The user does not exist'});
  if (!(/[0-9a-fA-F]{24}/.test(id))) return res.status(400).send({msg: 'The id is not valid mongodb id'});
  let oid = new Types.ObjectId(id);
  await Post.removeByCreatorId(oid);
  await User.findByIdAndDelete(oid);
  return res.status(200).send({msg: 'OK'});
});


export default usersrouter;
