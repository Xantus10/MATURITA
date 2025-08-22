import type { SessionData } from "./middlewares/session.ts";

declare global {
  namespace Express {
    export interface Request {
      session: {
        state: 'none' | 'valid' | 'invalid';
        id: string | undefined;
        data: SessionData | undefined
      }
    }
  }
}

export {}