import { Router, type Request, type Response } from "express";
import { loggedin } from "../middlewares/session.js";
import { Types } from "mongoose";
import User from "../db/models/user.js";

const usersrouter = Router();

usersrouter.use(loggedin);

usersrouter.get('/', async (req: Request, res: Response) => {
  
});

usersrouter.get('/:id', async (req: Request, res: Response) => {
  let id = req.params.id;
  if (!id) return res.status(404).send({msg: 'The user does not exist'});
  if (!(/[0-9a-fA-F]{24}/.test(id))) return res.status(400).send({msg: 'The id is not valid mongodb id'});
  let doc = await User.findById(new Types.ObjectId(id), { Name: 1 });
  if (!doc) return res.status(404).send({msg: 'The user does not exist'});
  return doc;
});


export default usersrouter;
