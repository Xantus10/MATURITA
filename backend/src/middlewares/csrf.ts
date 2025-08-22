import type { Request, Response, NextFunction } from "express";
import { randomBytes, createHmac } from "node:crypto";
import env from "../config/envconfig.js";

export const CSRF_SET_HEADER_NAME = 'X-Set-Csrf-Token';

export function generateCsrf(ssid: string) {
  let rand = randomBytes(32).toString('base64');
  let sig = createHmac('sha256', env.CSRF_SECRET).update(ssid + '.' + rand).digest('base64');
  return rand + '.' + sig
}

export function verifyCsrf(ssid: string, token: string) {
  let [rand, sig] = token.split('.');
  let vsig = createHmac('sha256', env.CSRF_SECRET).update(ssid + '.' + rand).digest('base64');
  return vsig === sig;
}

// IMPORTANT: use AFTER session middleware
export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  let token = req.get('X-Csrf-Token');
  req.csrf = {valid: false};
  if (token === undefined || req.session.state !== 'valid') {
    next();
    return;
  }
  req.csrf.valid = verifyCsrf(req.session.id as string, token as string);
  next();
}
