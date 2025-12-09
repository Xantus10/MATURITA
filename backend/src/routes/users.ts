/**
 * File: users.ts
 * Purpose: User related routes
 */

import { Router, type Request, type Response } from "express";
import { loggedin, checkRole } from "../middlewares/session.js";
import { Types } from "mongoose";
import User from "../db/models/user.js";
import Post from "../db/models/post.js";
import { SocialsKeys, type Socials } from "../db/interfaces/user.js";
import { capitalizeFirstLetter } from "../util/parse.js";

const usersrouter = Router();

// User must be logged in
usersrouter.use(loggedin);

/**
 * Get a list of users by their first and last name
 */
usersrouter.get('/list', checkRole('admin'), async (req: Request, res: Response) => {
  let first = (req.query.first) ? req.query.first : "";
  let last = (req.query.last) ? req.query.last : "";
  let limit = (req.query.limit) ? parseInt(req.query.limit as string) : 20;
  let docs = await User.find({ "Name.First": { $regex: `^${first}.*$`, $options: 'i' }, "Name.Last": { $regex: `^${last}.*$`, $options: 'i' } }).limit(limit);
  return res.status(200).send({users: docs});
});

/**
 * Get info about the currently logged in user
 */
usersrouter.get('/me', async (req: Request, res: Response) => {
  let id = new Types.ObjectId(req.session.data?.objId);
  let doc = await User.getUserData(id);
  return res.status(200).send(doc);
});

/**
 * Delete the account for the currently logged in user
 */
usersrouter.delete('/me', async (req: Request, res: Response) => {
  let id = new Types.ObjectId(req.session.data?.objId);
  await Post.removeByCreatorId(id);
  await User.findByIdAndDelete(id);
  return res.status(200).send({msg: 'OK'});
});

/**
 * Change a users role
 */
usersrouter.post('/role', checkRole('admin'), async (req: Request, res: Response) => {
  if (!req.body.userId) return res.status(400).send({msg: "'userId' is missing"});
  let userId = new Types.ObjectId(req.body.userId as string);
  if (!req.body.role) return res.status(400).send({msg: "'role' is missing"});
  let role = req.body.role;
  await User.setRole(userId, role);
  return res.status(200).send({msg: 'Role changed to '+role});
});

/**
 * Ban a user
 */
usersrouter.post('/ban', checkRole('admin'), async (req: Request, res: Response) => {
  if (!req.body.userId) return res.status(400).send({msg: "'userId' is missing"});
  let userId = new Types.ObjectId(req.body.userId as string);
  if (!req.body.reason) return res.status(400).send({msg: "'reason' is missing"});
  let reason = req.body.reason;
  if (!req.body.days) return res.status(400).send({msg: "'days' is missing"});
  let days = parseInt(req.body.days);
  let objId = (req.session.data?.objId) ? req.session.data?.objId : new Types.ObjectId();
  User.ban(userId, objId, days, reason);
  return res.status(200).send({msg: `User has been banned for ${days} days`});
});

/**
 * Update user socials
 */
usersrouter.post('/socials', async (req: Request, res: Response) => {
  let socials: {[key: string]: string} = {}
  SocialsKeys.forEach(k => {
    if (req.body[k]) socials[`Socials.${capitalizeFirstLetter(k)}`] = req.body[k];
  });
  let id = new Types.ObjectId(req.session.data?.objId);
  User.findByIdAndUpdate(id, socials);
  return res.status(200).send({msg: 'Updated'});
})



// NO ROUTES BEYOND THIS POINT!!! - This route will match every other route

/**
 * Get info about the specified user
 */
usersrouter.get('/:id', async (req: Request, res: Response) => {
  let id = req.params.id;
  if (!id) return res.status(404).send({msg: 'The user does not exist'});
  if (!(/[0-9a-fA-F]{24}/.test(id))) return res.status(400).send({msg: 'The id is not valid mongodb id'});
  let doc = await User.getUserData(new Types.ObjectId(id));
  if (!doc) return res.status(404).send({msg: 'The user does not exist'});
  return res.status(200).send(doc);
});

/**
 * Delete the specified user
 */
usersrouter.delete('/:id', checkRole('admin'), async (req: Request, res: Response) => {
  let id = req.params.id;
  if (!id) return res.status(404).send({msg: 'The user does not exist'});
  if (!(/[0-9a-fA-F]{24}/.test(id))) return res.status(400).send({msg: 'The id is not valid mongodb id'});
  let oid = new Types.ObjectId(id);
  await Post.removeByCreatorId(oid);
  await User.findByIdAndDelete(oid);
  return res.status(200).send({msg: 'User deleted'});
});

export default usersrouter;
