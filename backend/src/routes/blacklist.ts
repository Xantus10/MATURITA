import { Router, type Request, type Response } from "express";
import { checkRole, loggedin } from "../middlewares/session.js";
import Blacklist from "../db/models/blacklist.js";

const blackrouter = Router();

blackrouter.use(loggedin);
blackrouter.use(checkRole('admin'));

blackrouter.get('/', async (req: Request, res: Response) => {
  let blists = Blacklist.find();
  return res.status(200).send({blists: blists});
});

blackrouter.post('/', async (req: Request, res: Response) => {
  if (!req.body.microsoftId) return res.status(400).send({msg: "'microsoftId' is missing"});
  let microsoftId = req.body.microsoftId;
  if (!req.body.reason) return res.status(400).send({msg: "'reason' is missing"});
  let reason = req.body.reason;
  Blacklist.create({ MicrosoftId: microsoftId, Reason: reason });
  return res.status(200).send({msg: `Microsoft id ${microsoftId} blacklisted`});
});

export default blackrouter;
