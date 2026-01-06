import { Types } from "mongoose";

/**
 * Single message data
 */
export interface MessageIF {
  /**
   * Sender of the message
   */
  Sender: Types.ObjectId;
  
  /**
   * User that should recieve the message
   */
  TargetUser?: Types.ObjectId;

  /**
   * Group that should recieve the message
   */
  TargetGroup?: 'admin' | 'all';

  /**
   * When was the message sent
   */
  SentAt: Date;

  /**
   * Title of the message
   */
  Title: string;

  /**
   * Content of the message
   */
  Content: string;
};
