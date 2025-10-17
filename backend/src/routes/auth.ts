/**
 * File auth.ts
 * Purpose: Routes for authentication related actions
 */

import { Router, type Request, type Response } from "express";
import { OAuth } from "../oauth/oauthkeys.js";
import { Session } from "../middlewares/session.js";
import { generateCsrf, CSRF_SET_HEADER_NAME } from "../middlewares/csrf.js";
import User from "../db/models/user.js";
import { Types } from "mongoose";

const authrouter = Router();

/**
 * Login route
 */
authrouter.post('/idtoken', async (req: Request, res: Response) => {
  let idtoken = await OAuth.validateIdToken(req.body.idtoken);
  if (idtoken.oid === '') {
    return res.status(401).send({msg: "Invalid Id Token!"});
  }
  let exists = await User.findOne({ MicrosoftId: idtoken.oid }, { _id: 1, Role: 1 });
  let objId: Types.ObjectId;
  let role: 'user' | 'admin';
  if (exists === null) {
    let firstUserCheck = (await User.findOne()) === null;
    let userRole = (firstUserCheck) ? 'admin' : 'user';
    let doc = await User.create({ MicrosoftId: idtoken.oid, Name: { First: idtoken.given_name, Last: idtoken.family_name }, Role: userRole });
    objId = doc._id;
    role = doc.Role;
  } else {
    objId = exists._id;
    role = exists.Role;
    User.updateLastLogin(objId);
  }
  let ssid = Session.sessionCreate({objId: objId, role: role});
  let csrf = generateCsrf(ssid);
  return res.header(CSRF_SET_HEADER_NAME, csrf).cookie(Session.COOKIE_NAME, ssid, Session.COOKIE_OPTS).cookie(Session.CONTROL_COOKIE_NAME, role, {maxAge: Session.COOKIE_OPTS.maxAge}).status(200).send({msg: "Done!"});
});

/**
 * Logout route
 */
authrouter.post('/logout', async (req: Request, res: Response) => {
  if (req.session.id) Session.sessionRemove(req.session.id);
  res.clearCookie(Session.COOKIE_NAME);
  res.clearCookie(Session.CONTROL_COOKIE_NAME);
  return res.status(200).send({msg: "Logged out"});
});


export default authrouter;
