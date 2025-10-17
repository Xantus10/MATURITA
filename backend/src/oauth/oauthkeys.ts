/**
 * File: oauthkeys.ts  
 * Purpose: Check the validity of provided oauth id tokens
 */

import NodeRSA from "node-rsa";
import jsonwebtoken, { type JwtPayload } from "jsonwebtoken";

import env from "../config/envconfig.js";

/**
 * Object mapping keyId -> PEM key
 */
type KeysDict = {[kid: string]: string};

/**
 * Key info returned by Microsoft
 */
interface MSKey {
  kty: string;
  use: string;
  kid: string;
  x5t: string;
  n: string;
  e: string;
};

/**
 * Response from Microsoft API features an array of keys
 */
interface MSResponse {
  keys: MSKey[];
};

/**
 * Important fields in an id token
 */
interface IdTokenPayload extends JwtPayload {
  /**
   * Microsoft Id used in db
   */
  oid: string;

  /**
   * Last name
   */
  family_name: string;

  /**
   * First name
   */
  given_name: string;
};


/**
 * Class for managing oauth keys + id token validation
 */
class OAuth_Agent {
  /**
   * Public keys storage
   */
  public keys: KeysDict = {};

  /**
   * When was the last key renewal
   */
  private lastKeysAccess = Math.floor(new Date().getTime() / 1000);

  /**
   * !!! Do not create a new one; Use a single OAuth object provided by the oauthkeys.ts file !!!  
   *   
   * This class is not exported on purpose to avoid any misconceptions about the design
   */
  public constructor() {
    this.fetchKeys();
  }

  /**
   * Fetch and import new keys
   */
  private async fetchKeys() {
    this.lastKeysAccess = Math.floor(new Date().getTime() / 1000);
    let res = await fetch('https://login.microsoftonline.com/common/discovery/v2.0/keys');
    let js = await res.json() as MSResponse;
    this.keys = {}
    js.keys.forEach((val: MSKey) => {
      let k = new NodeRSA();
      k.importKey({e: Buffer.from(val.e, 'base64'), n: Buffer.from(val.n, 'base64')});
      this.keys[val.kid] = k.exportKey('pkcs8-public-pem');
    })
  }

  /**
   * Return the key with corresponding kid
   * 
   * @param kid Key id
   * @returns Public key for validating JWT
   */
  public async getKey(kid: string) {
    if ((Math.floor(new Date().getTime() / 1000) - this.lastKeysAccess) > 86400) {
      await this.fetchKeys();
    }
    return this.keys[kid];
  }

  /**
   * Validate an id token
   * 
   * @param idToken The id token recieved from oauth
   * @returns Payload of the token (All fields are empty for invalid token)
   */
  public async validateIdToken(idToken: string) {
    let decoded = jsonwebtoken.decode(idToken, {complete: true});
    if (decoded === null) return {oid: '', family_name: '', given_name: ''};
    let kid = decoded?.header.kid as string;
    let k = await this.getKey(kid);
    if (k === undefined) return {oid: '', family_name: '', given_name: ''};
    try {
      let ver = jsonwebtoken.verify(idToken, k, {issuer: env.MICROSOFT_ISSUER_URL, clockTimestamp: Math.floor(new Date().getTime() / 1000), audience: env.MICROSOFT_APP_ID});
      return (ver as IdTokenPayload);
    } catch {
      return {oid: '', family_name: '', given_name: ''};
    }
  }
};


/**
 * OAuth object to manage keys and validation
 */
export const OAuth = new OAuth_Agent();
