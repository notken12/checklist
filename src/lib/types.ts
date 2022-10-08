import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import { browser } from '$app/environment';

export type Id = string;

export type Item = {
  name: string;
  id: Id;
};

export type Day = {
  date: Date;
  /** IDs of completed items */
  completed: Record<Id, boolean>;
};

export type DayColumn = {
  index: number | null;
  date: Date;
};

export type List = {
  id: Id;
  name: string;
  items: Item[];
  days: Day[];
};

export type UserData = {
  id: Id;
  name: string | null;
  /** URL of pfp */
  pfp: string | null;
  lists: List[];
};

type AsyncOrSync<T> = T | Promise<T>;
type Callback<T> = (data: T) => AsyncOrSync<void>;

export interface DataSource<T> {
  initialized: boolean;
  read(): AsyncOrSync<T | void>;
  write(data: T | null): AsyncOrSync<boolean>;
  delete(): AsyncOrSync<boolean>;
  init(): AsyncOrSync<{ blankSource: boolean }>;
  subscribe(callback: Callback<T>): void;
}

export class IDBDataSource<T> implements DataSource<T> {
  initialized = false;
  dbName = 'user';
  storeName = 'user';
  dataId = 'local';
  db: IDBPDatabase | null = null;
  callback: Callback<T> | null = null;
  async init() {
    if (!browser) return { blankSource: true };
    let blankSource = false;
    this.db = await openDB(this.dbName, 1, {
      upgrade: (db, oldVersion, newVersion, transaction) => {
        // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
        switch (oldVersion) {
          case 0: {
            // Placeholder to execute when database is created (oldVersion is 0)
            blankSource = true;
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
    });
    this.initialized = true;
    return { blankSource };
  }
  async read() {
    if (!browser) return;
    if (!this.db) throw new Error('not inited');
    const tx = this.db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    // Because in our case the `id` is the key, we would
    // have to know in advance the value of the id to
    // retrieve the record
    const value = await store.get(this.dataId);
    return value as T;
  }
  async write(data: T | null) {
    if (!data) return false;
    if (!browser) return false;
    if (!this.db) throw new Error('not inited');
    const tx = this.db?.transaction(this.storeName, 'readwrite');
    if (!tx) return false;
    const store = tx.objectStore(this.storeName);
    await store.put({ ...data, id: this.dataId });
    await tx.done;

    const newVal = await this.read();
    if (newVal && this.callback) this.callback(newVal);

    return true;
  }
  async delete() {
    if (!browser) return false;
    if (!this.db) throw new Error('not inited');
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    // Because in our case the `id` is the key, we would
    // have to know in advance the value of the id to
    // retrieve the record
    await store.delete(this.dataId);
    return true;
  }
  async subscribe(callback: Callback<T>) {
    this.callback = callback;
    const val = await this.read();
    if (val) this.callback(val);
  }
}

export const addItemToList = (user: UserData, listId: Id, item: Item) => {
  const list = user.lists.find((l) => l.id === listId);
  list?.items.push(item);
  return list;
};

export const updateItem = (user: UserData, listId: Id, itemId: Id, newItem: Partial<Item>) => {
  const list = user.lists.find((l) => l.id === listId);
  const item = list?.items.find((i) => i.id === itemId);
  if (item) Object.assign(item, newItem);
  return item;
};

// Function to find insert position of K
export const find_index = <T>(arr: T[], K: T, cmp: (a: T, b: T) => number) => {
  // Traverse the array
  for (let i = 0; i < arr.length; i++)
    // If K is found
    if (cmp(arr[i], K) === 0) return { index: i, match: true };
    // If current array element
    // exceeds K
    else if (cmp(arr[i], K) > 0) return { index: i, match: false };

  // If all elements are smaller
  // than K
  return { index: arr.length, match: false };
};

export const setDayState = (user: UserData, listId: Id, newDay: Day) => {
  const list = user.lists.find((l) => l.id === listId);
  if (!list) throw new Error();
  const { index, match } = find_index(
    list.days,
    newDay,
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  if (match) {
    Object.assign(list.days[index].completed, newDay.completed);
  } else list.days.splice(index, 0, newDay);
  return { newDay: list.days[index], newUser: user };
};
