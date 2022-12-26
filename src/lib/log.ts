import { writable } from "svelte/store";
export const done = writable(false);
export const log = writable({ percent: 0, message: "initializing renderer" });
