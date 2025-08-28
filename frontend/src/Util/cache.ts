import { get } from "./http";


export interface UserData {
  name: {
    first: string;
    last: string;
  };
};

class UserCacheClass {
  private cache: {[key: string]: UserData} = {};

  public constructor() {}

  public async getUserData(id: string): Promise<UserData | null> {
    if (Object.hasOwn(this.cache, id)) {
      return this.cache[id];
    }
    return await this.fetchUserData(id);
  }

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

export const UserCache = new UserCacheClass();
