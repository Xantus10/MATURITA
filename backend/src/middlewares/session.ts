/**
 * File: session.ts  
 * Purpose: Session authentication management
 */

import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "node:crypto";
import type { Types } from "mongoose";
import type { UserIF } from "../db/interfaces/user.js";

/**
 * Data to store per-session (passed through arguments)
 */
export interface SessionDataArg {
  /**
   * User._id to interact with db
   */
  objId: Types.ObjectId;

  /**
   * Quick access to user role
   */
  role: UserIF['Role'];
};

/**
 * Data to store per-session (stored in req.session)
 */
export interface SessionData {
  /**
   * User._id to interact with db
   */
  objId: Types.ObjectId;

  /**
   * Quick access to user role
   */
  role: UserIF['Role'];

  /**
   * When was the session created (For server side session expiration)
   */
  createdAt: number;
};

/**
 * Mapping ssid -> Session data
 */
type SessionsObj = {[ssid: string]: SessionData};

/**
 * A class to manage sessions
 */
class Session_Agent {
  /**
   * The cookie name to store the session id in
   */
  public COOKIE_NAME = 'SESSION_ID';
  /**
   * The cookie name to store user role in
   */
  public CONTROL_COOKIE_NAME = 'ROLE';
  /**
   * Security options to set for the session id holding cookie  
   * (NOT for user role cookie)
   */
  public COOKIE_OPTS = {httpOnly: true, sameSite: true, maxAge: 86400000, secure: false};

  /**
   * Internal session data storage
   */
  private sessions: SessionsObj = {};

  /**
   * !!! Do not create a new one; Use a single Session object provided by the session.ts file !!!  
   *   
   * This class is not exported on purpose to avoid any misconceptions about the design
   */
  public constructor() {}

  /**
   * Session middleware  
   * !!! Wrap with (req, res, next) => {sessionParser(req, res, next)} !!!
   *  
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   * @returns Modifies req.session
   */
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

  /**
   * Remove a stale session when a user logs in again
   * 
   * @param objId User._id to look for in session data
   */
  private removeByObjId(objId: SessionData['objId']) {
    for (const key in this.sessions) {
      if (this.sessions[key]?.objId.equals(objId)) {
        this.sessionRemove(key);
      }
    }
  }
  
  /**
   * Create a new session
   * 
   * @param data Data to be associated to the ssid
   * @returns Session id
   */
  public sessionCreate(data: SessionDataArg): string {
    this.removeByObjId(data.objId);
    let ssid = uuidv4() + '.' + randomBytes(32).toString('base64');
    let ndata: SessionData = {...data, createdAt: Math.floor(new Date().getTime() / 1000)};
    this.sessions[ssid] = ndata;
    return ssid;
  }

  /**
   * Remove a session at logout
   * 
   * @param ssid Session id to remove
   */
  public sessionRemove(ssid: string) {
    delete this.sessions[ssid];
  }
};

/**
 * Middleware to check if the user is authenticated (incl. session+csrf)
 * 
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 * @returns If the request is invalid, it returns a 401 response
 */
export function loggedin(req: Request, res: Response, next: NextFunction) {
  if (req.session.state !== 'valid' || !req.csrf.valid) {
    res.clearCookie(Session.COOKIE_NAME);
    res.clearCookie(Session.CONTROL_COOKIE_NAME);
    return res.status(401).send({msg: 'Not logged in!'});
  }
  next();
}

/**
 * Middleware wrapper to check req.session.role
 * 
 * @param role Role to check for
 * @returns If the user is not {role}, it returns a 403 response
 */
export function checkRole(role:  UserIF['Role']) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session.data?.role !== role) {
      return res.status(403).send({msg: `You need to be ${role} to perform this operation!`});
    }
    next();
  }
}

/**
 * Session object to manage sessions
 */
export const Session = new Session_Agent();
