import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    // eslint-disable-next-line no-underscore-dangle
    this._storage = storage;
  }

  public set(key: string, value: any): boolean {
    if (this.storage) {
      // eslint-disable-next-line no-underscore-dangle
      this._storage.set(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  public async get(key: string): Promise<any> {
    if (this.storage) {
      // eslint-disable-next-line no-underscore-dangle
      return JSON.parse(await this._storage.get(key));
    }
    return null;
  }

  public remove(key: string): boolean {
    if (this.storage) {
      this.storage.remove(key);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }
}
