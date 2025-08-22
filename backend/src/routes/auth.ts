import { Router, type Request, type Response } from "express";
import { OAuth } from "../oauth/oauthkeys.js";
import { Session } from "../middlewares/session.js";
import { generateCsrf, CSRF_SET_HEADER_NAME } from "../middlewares/csrf.js";

const authrouter = Router();

authrouter.get('/idtoken', async (req: Request, res: Response) => {
  let idtoken = await OAuth.validateIdToken(req.body.idtoken);
  if (idtoken.oid === '') {
    return res.status(401).send({msg: "Invalid Id Token!"});
  }
  let ssid = Session.sessionCreate({microsoftId: idtoken.oid, role: 'user'});
  let csrf = generateCsrf(ssid);
  return res.header(CSRF_SET_HEADER_NAME, csrf).cookie(Session.COOKIE_NAME, ssid, Session.COOKIE_OPTS).cookie(Session.CONTROL_COOKIE_NAME, true).status(200).send({msg: "Done!"});
});


export default authrouter;
