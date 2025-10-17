/**
 * File: csrf.ts  
 * Purpose: Generation and verification of CSRF tokens
 */

import type { Request, Response, NextFunction } from "express";
import { randomBytes, createHmac } from "node:crypto";
import env from "../config/envconfig.js";

/**
 * The name to use when setting the CSRF token on FE
 */
export const CSRF_SET_HEADER_NAME = 'X-Set-Csrf-Token';

/**
 * Generate a new csrf token
 * 
 * @param ssid SessionId to tie the csrf token to
 * @returns A signed csrf token in format {randomToken}.{signature}
 */
export function generateCsrf(ssid: string) {
  let rand = randomBytes(32).toString('base64');
  let sig = createHmac('sha256', env.CSRF_SECRET).update(ssid + '.' + rand).digest('base64');
  return rand + '.' + sig
}

/**
 * Verify a csrf token
 * 
 * @param ssid SessionId presumably tied to the csrf token
 * @param token The csrf token to validate
 * @returns true if signatures match and the token is valid, false otherwise
 */
export function verifyCsrf(ssid: string, token: string) {
  let [rand, sig] = token.split('.');
  let vsig = createHmac('sha256', env.CSRF_SECRET).update(ssid + '.' + rand).digest('base64');
  return vsig === sig;
}

/**
 * Middleware function to automatically verify the csrf token  
 * IMPORTANT: use AFTER session middleware
 * 
 * @param req Express request
 * @param res Express Response
 * @param next Express NextFunction
 * @returns Modifies req.csrf
 */
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
