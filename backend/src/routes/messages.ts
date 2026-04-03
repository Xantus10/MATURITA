/**
 * File: messages.ts
 * Purpose: Messages related routes
 */

import { Router, type Request, type Response } from "express";
import { loggedin, checkRole } from "../middlewares/session.js";
import { Types } from "mongoose";
import Message from "../db/models/message.js";
import User from "../db/models/user.js";

const messagesrouter = Router();

// User must be logged in
messagesrouter.use(loggedin);

/**
 * Get a list of messages for the user
 */
messagesrouter.get('/', async (req: Request, res: Response) => {
  let id = new Types.ObjectId(req.session.data?.objId);
  let orQuery = [{TargetUser: id}, {TargetGroup: 'all'}];
  if (req.session.data?.role === 'admin') {
    orQuery.push({TargetGroup: 'admin'})
  }
  let msgs = await Message.find({ $or: orQuery }).sort({ SentAt: -1 });
  return res.status(200).send({msgs: msgs});
});

/**
 * Post a reaction message
 */
messagesrouter.post('/react', async (req: Request, res: Response) => {

  let target = req.body.target as string;
  if (!target) {
    return res.status(400).send({msg: 'msg.4.0'})
  }
  let targetId = new Types.ObjectId(target);

  let post = req.body.post as string;
  if (!post) {
    return res.status(400).send({msg: 'msg.4.1'})
  }

  let senderId = new Types.ObjectId(req.session.data?.objId);

  if (senderId.equals(targetId)) {
    return res.status(403).send({msg: 'msg.4.2'})
  }

  let name = await User.findById(senderId);

  await Message.create({ Sender: senderId, TargetUser: targetId, Title: 'CODE:REACT', Content: `${name?.Name.First}§${name?.Name.Last}§${post}` });

  return res.status(201).send({msg: 'msg.2.0'});
});

/**
 * Post a group message (user must be admin)
 */
messagesrouter.post('/group', checkRole('admin'), async (req: Request, res: Response) => {

  let target = req.body.target as string;
  if (!target) {
    return res.status(400).send({msg: 'msg.4.0'})
  }
  let title = req.body.title as string;
  if (!title) {
    return res.status(400).send({msg: 'msg.4.3'})
  }
  let cont = req.body.content as string;
  if (!cont) {
    return res.status(400).send({msg: 'msg.4.4'})
  }

  let senderId = new Types.ObjectId(req.session.data?.objId);

  await Message.create({ Sender: senderId, TargetGroup: target, Title: title, Content: cont });

  return res.status(201).send({msg: 'msg.2.1'});
});



export default messagesrouter;
