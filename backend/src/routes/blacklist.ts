/**
 * File: blacklist.ts
 * Purpose: Blacklists related routes
 */

import { Router, type Request, type Response } from "express";
import { checkRole, loggedin } from "../middlewares/session.js";
import User from "../db/models/user.js";
import Blacklist from "../db/models/blacklist.js";
import Post from "../db/models/post.js";

const blackrouter = Router();

// To access the blacklist API user must be logged in and an admin
blackrouter.use(loggedin);
blackrouter.use(checkRole('admin'));

/**
 * Return a list of all blacklists
 */
blackrouter.get('/', async (req: Request, res: Response) => {
  let blists = Blacklist.find();
  return res.status(200).send({blists: blists});
});

/**
 * Create a new blacklist record
 */
blackrouter.post('/', async (req: Request, res: Response) => {
  if (!req.body.microsoftId) return res.status(400).send({msg: "'microsoftId' is missing"});
  let microsoftId = req.body.microsoftId;
  if (!req.body.reason) return res.status(400).send({msg: "'reason' is missing"});
  let reason = req.body.reason;
  let usr = await User.findOne({ MicrosoftId: microsoftId });
  if (!usr) return res.status(404).send({msg: "User not found"});
  await Post.removeByCreatorId(usr._id);
  await User.findByIdAndDelete(usr._id);
  await Blacklist.create({ MicrosoftId: microsoftId, Reason: reason });
  return res.status(201).send({msg: `Microsoft id ${microsoftId} blacklisted`});
});

export default blackrouter;
