import NodeRSA from "node-rsa";
import jsonwebtoken, { type JwtPayload } from "jsonwebtoken";

import env from "../config/envconfig.js";

type KeysDict = {[kid: string]: string};

interface MSKey {
  kty: string;
  use: string;
  kid: string;
  x5t: string;
  n: string;
  e: string; // More but I CBA
};

interface MSResponse {
  keys: MSKey[];
};

interface IdTokenPayload extends JwtPayload {
  oid: string;
  family_name: string;
  given_name: string;
};


class OAuth_Agent {
  public keys: KeysDict = {};

  private lastKeysAccess = Math.floor(new Date().getTime() / 1000);

  public constructor() {
    this.fetchKeys();
  }

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

  public async getKey(kid: string) {
    if ((Math.floor(new Date().getTime() / 1000) - this.lastKeysAccess) > 86400) {
      await this.fetchKeys();
    }
    return this.keys[kid];
  }

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


export const OAuth = new OAuth_Agent();
