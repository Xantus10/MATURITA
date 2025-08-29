import type { SessionData } from "./middlewares/session.ts";
import multer from "multer";

declare global {
  namespace Express {
    export interface Request {
      session: {
        state: 'none' | 'valid' | 'invalid';
        id: string | undefined;
        data: SessionData | undefined;
      },
      csrf: {
        valid: boolean;
      },
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {}