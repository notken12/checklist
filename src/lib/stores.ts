import { onMount } from "svelte";
import { writable, type Writable } from "svelte/store";
import { IDBDataSource, type UserData } from "./types";

export const dataSource: Writable<IDBDataSource<UserData>> = writable(new IDBDataSource<UserData>());

export const user: Writable<UserData | null> = writable(null)

