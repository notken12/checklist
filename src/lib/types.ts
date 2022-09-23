import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import { browser } from '$app/environment';

export type Id = string;

export type Item = {
  name: string;
  id: Id;
}

export type Day = {
  date: Date;
  /** IDs of completed items */
  completed: Record<Id, boolean>;
}

export type List = {
  id: Id;
  name: string;
  items: Item[];
  days: Day[];
}

export type UserData = {
  id: Id;
  name: string | null;
  /** URL of pfp */
  pfp: string | null;
  lists: List[];
}

type AsyncOrSync<T> = T | Promise<T>

export interface DataSource<T> {
  read(): AsyncOrSync<T | void>;
  write(data: T): AsyncOrSync<boolean>
  init(): AsyncOrSync<{ blankSource: boolean }>;
  subscribe(callback: (data: T) => void): void;
}

export class IDBDataSource implements DataSource<UserData> {
  dbName = 'user'
  storeName = 'user'
  userId = 'local'
  db: IDBPDatabase<unknown> | null = null
  async init() {
    if (!browser) return { blankSource: true }
    let blankSource = false
    this.db = await openDB(this.dbName, 1, {
      upgrade: (db, oldVersion, newVersion, transaction) => {
        // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
        switch (oldVersion) {
          case 0: {
            // Placeholder to execute when database is created (oldVersion is 0)
            blankSource = true
          }
          // eslint-disable-next-line no-fallthrough
          case 1: {
            // Create a store of objects
            db.createObjectStore(this.storeName, {
              // The `id` property of the object will be the key, and be incremented automatically
              autoIncrement: true,
              keyPath: 'id'
            });
          }
        }
      }
    })
    return { blankSource }
  }
  async read() {
    if (!browser) return
    if (!this.db) throw new Error('not inited')
    const tx = this.db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName);
    // Because in our case the `id` is the key, we would
    // have to know in advance the value of the id to
    // retrieve the record
    const value = await store.get(this.userId);
    return value as UserData;
  }
  async write(data: UserData) {
    if (!browser) return false;
    if (!this.db) throw new Error('not inited')
    const tx = this.db?.transaction(this.storeName, 'readwrite');
    if (!tx) return false
    const store = tx.objectStore(this.storeName);
    await store.add({ ...data, id: this.userId });
    await tx.done;
    return true;
  }
  async subscribe(callback: (data: UserData) => void) {
    const val = await this.read()
    if (val)
      callback(val);
  }
}
