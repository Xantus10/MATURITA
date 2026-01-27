import { Model, Types } from "mongoose";

/**
 * Data associated with each post
 */
export interface PostIF {
  /**
   * User._id of the creator
   */
  CreatorId: Types.ObjectId;

  /**
   * Title of the post
   */
  Title: string;

  /**
   * When was the post originally created
   */
  CreatedAt: Date;

  /**
   * When to remove the post (TTL index with no delay)
   */
  RemoveAt: Date;

  /**
   * Subject tags the post is associated with
   */
  Subjects: string[];

  /**
   * State of the book
   */
  State: 'Like new' | 'Good' | 'Worn';

  /**
   * Years the book is used in
   */
  Years: number[];

  /**
   * Price info for the book
   */
  Price: {
    /**
     * Lower end of the price spectrum
     */
    Min: number;
    /**
     * Higher end of the price spectrum (if is eq to lower end => the price is not a spectrum)
     */
    Max: number;
  };

  /**
   * Paths to associated photos
   */
  Photos: string[];

  /**
   * Additional info/messages/updates
   */
  AddInfo: string[];
};

export interface PostModelIF extends Model<PostIF> {
  /**
   * Extend the posts lifespan
   * 
   * @param id Post._id to identify the post
   * @param newDate New value of Post.RemoveAt field
   */
  extendRemoveAt(id: Types.ObjectId, newDate: Date): Promise<void>;

  /**
   * Remove all posts posted by a user
   * 
   * @param id User._id to match with Post.CreatorId
   */
  removeByCreatorId(id: Types.ObjectId): Promise<void>;

  /**
   * Add and AddInfo msg
   * 
   * @param id Post._id to identify the post
   */
  addInfo(id: Types.ObjectId, msg: string): Promise<void>;
};
