import { Model, Types } from "mongoose";

/**
 * Data associated with a singular user ban
 */
export interface BanData {
  /**
   * When was the ban issued
   */
  CreatedAt: Date;

  /**
   * Date the ban is valid until
   */
  Until: Date;

  /**
   * User._id of the user who issued the ban
   */
  IssuedBy: Types.ObjectId;

  /**
   * Reason for the ban
   */
  Reason: string;
}

/**
 * Compare all the ban data and conclude if the user has an active ban
 * 
 * @param bans Ban data
 * @returns A Ban object if the user is banned, null otherwise
 */
export function isBanned(bans: BanData[]) {
  let now = new Date();
  for (let ban of bans) {
    if (now > ban.CreatedAt && now < ban.Until) {
      return ban;
    }
  }
  return null;
}

/**
 * Object of optional contacts
 */
export interface Socials {
    /**
     * Email address
     */
    Email: string;

    /**
     * Phone number
     */
    Phone: string;

    /**
     * Instagram username
     */
    Instagram: string;

    /**
     * Discord username
     */
    Discord: string;
}

/**
 * Array of all socials keys
 */

export const SocialsKeys = ['Email', 'Phone', 'Instagram', 'Discord'];

/**
 * User data
 */
export interface UserIF {
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
   * Role assigned to the user
   */
  Role: 'user' | 'admin';

  /**
   * When was the last login of the user (TTL index on 1.5 years)
   */
  LastLogin: Date;

  /**
   * Array of the users bans
   */
  Bans: BanData[];

  /**
   * Object of optional contacts
   */
  Socials: Socials;
};

export interface UserModelIF extends Model<UserIF> {
  /**
   * Update the User.LastLogin to current date
   * 
   * @param id User._id to identify the user
   */
  updateLastLogin(id: Types.ObjectId): Promise<void>;

  /**
   * Setter for user role (Used to change roles)
   * 
   * @param id User._id to identify the user
   * @param role A role to assign to the user
   */
  setRole(id: Types.ObjectId, role: UserIF['Role']): Promise<void>;

  /**
   * Ban the specified user
   * 
   * @param id User._id to identify the user to get banned
   * @param issuedBy User._id to identify the user who issued the ban
   * @param days No of days to ban the user for
   * @param reason Reason for ban
   */
  ban(id: Types.ObjectId, issuedBy: Types.ObjectId, days: number, reason: string): Promise<void>;
};
