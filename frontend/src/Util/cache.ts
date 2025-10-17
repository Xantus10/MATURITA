/**
 * File: cache.ts
 * Purpose: Various client side caches to limit requests
 */

import { get } from "./http";

/**
 * User data stored in cache
 */
export interface UserData {
  /**
   * Name of the user
   */
  name: {
    /**
     * First name
     */
    first: string;

    /**
     * Last name
     */
    last: string;
  };
};

/**
 * Class for user cache
 */
class UserCacheClass {
  /**
   * cache of id -> user data
   */
  private cache: {[key: string]: UserData} = {};

  /**
   * !!! Do not create a new one; Use a single UserCache object provided by the cache.ts file !!!  
   *   
   * This class is not exported on purpose to avoid any misconceptions about the design
   */
  public constructor() {}

  /**
   * Get the user data based on id
   * 
   * @param id Id of the user
   * @returns User's data or null if failed
   */
  public async getUserData(id: string): Promise<UserData | null> {
    if (Object.hasOwn(this.cache, id)) {
      return this.cache[id];
    }
    return await this.fetchUserData(id);
  }

  /**
   * Request user's data from BE if cache miss
   * 
   * @param id Id of the user
   * @returns User's data or null if failed
   */
  private async fetchUserData(id: string) {
    let res = await get(`/users/${id}`);
    let js = await res?.json();
    if (res?.status === 200) {
      this.cache[id] = {name: {first: js.Name.First, last: js.Name.Last}}
      return this.cache[id]
    }
    return null;
  }
};

/**
 * Cache of user's data
 */
export const UserCache = new UserCacheClass();
