import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "node:crypto";
import type { Types } from "mongoose";
import type { UserIF } from "../db/interfaces/user.js";

export interface SessionDataArg {
  objId: Types.ObjectId;
  role: UserIF['Role'];
};

export interface SessionData {
  objId: Types.ObjectId;
  role: UserIF['Role'];
  createdAt: number;
};

type SessionsObj = {[ssid: string]: SessionData};

class Session_Agent {
  public COOKIE_NAME = 'SESSION_ID';
  public CONTROL_COOKIE_NAME = 'ROLE';
  public COOKIE_OPTS = {httpOnly: true, sameSite: true, maxAge: 86400000, secure: false};

  private sessions: SessionsObj = {};

  public constructor() {}

  public sessionParser(req: Request, res: Response, next: NextFunction) {
    const ssid = req.cookies[this.COOKIE_NAME];
    const control = req.cookies[this.CONTROL_COOKIE_NAME];
    req.session = {state: 'none', id: undefined, data: undefined};
    if (control === undefined) {
      next();
      return;
    }
    if (ssid === undefined) {
      req.session.state = 'invalid';
      next();
      return;
    }
    if (!(this.sessions.hasOwnProperty(ssid))) {
      req.session.state = 'invalid';
      next();
      return;
    }
    if ((Math.floor(new Date().getTime() / 1000) - (this.sessions[ssid as string] as SessionData).createdAt) > this.COOKIE_OPTS.maxAge/1000) {
      req.session.state = 'invalid';
      delete this.sessions[ssid as string];
      next();
      return;
    }
    req.session.state = 'valid';
    req.session.id = ssid as string;
    req.session.data = this.sessions[ssid as string];
    next();
  }
  
  public sessionCreate(data: SessionDataArg): string {
    let ssid = uuidv4() + '.' + randomBytes(32).toString('base64');
    let ndata: SessionData = {...data, createdAt: Math.floor(new Date().getTime() / 1000)};
    this.sessions[ssid] = ndata;
    return ssid;
  }

  public sessionRemove(ssid: string) {
    delete this.sessions[ssid];
  }
};

export function loggedin(req: Request, res: Response, next: NextFunction) {
  if (req.session.state !== 'valid' || !req.csrf.valid) {
    res.clearCookie(Session.COOKIE_NAME);
    res.clearCookie(Session.CONTROL_COOKIE_NAME);
    return res.status(401).send({msg: 'Not logged in!'});
  }
  next();
}

export function checkRole(role:  UserIF['Role']) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session.data?.role !== role) {
      return res.status(403).send({msg: `You need to be ${role} to perform this operation!`});
    }
    next();
  }
}

export const Session = new Session_Agent();
