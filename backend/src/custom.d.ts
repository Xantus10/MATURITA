/**
 * File: custom.d.ts
 * Purpose: Adding custom appendages to types
 */

import type { SessionData } from "./middlewares/session.ts";
import multer from "multer";

declare global {
  namespace Express {
    export interface Request {
      /**
       * Session related info
       */
      session: {
        /**
         * State of the session (Is the authentication valid)
         */
        state: 'none' | 'valid' | 'invalid';

        /**
         * Session id
         */
        id: string | undefined;

        /**
         * Data tied to the session
         */
        data: SessionData | undefined;
      },

      /**
       * CSRF related info
       */
      csrf: {
        /**
         * Is the provided CSRF token valid
         */
        valid: boolean;
      },

      /**
       * Multer single file upload
       */
      file?: Express.Multer.File;

      /**
       * Multer multi file upload
       */
      files?: Express.Multer.File[];
    }
  }
}

export {}