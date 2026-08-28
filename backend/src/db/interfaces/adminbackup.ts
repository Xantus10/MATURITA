import { Types } from "mongoose";

/**
 * Data for static admin account backups
 */
export interface AdminBackupIF {
  /**
   * MicrosoftId of the associated Office365 account
   */
  MicrosoftId: string;

  /**
   * The name recieved through Office365
   */
  Name: {
    /**
     * First name of the user
     */
    First: string;
    /**
     * Last name of the user
     */
    Last: string;
  };

  /**
   * Original _id of the account
   */
  SavedId: Types.ObjectId;
};