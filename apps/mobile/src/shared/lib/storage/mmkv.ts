import { createMMKV, type MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const globalStorage = createMMKV({ id: "app-global-storage" });

let userStorageInstance: MMKV | null = null;

export const initializeUserStorage = (userId: string) => {
	userStorageInstance = createMMKV({
		id: `user-${userId}-storage`,
	});
	return userStorageInstance;
};

export const getUserStorage = () => userStorageInstance;

export const clearUserStorageInstance = () => {
	userStorageInstance = null;
};

// 👉 ADAPTER ĐỘNG DÀNH RIÊNG CHO ZUSTAND LOGGED-IN USER
export const dynamicZustandStorage: StateStorage = {
	setItem: (name, value) => {
		const storage = getUserStorage();
		if (storage) storage.set(name, value);
	},
	getItem: (name) => {
		const storage = getUserStorage();
		return storage ? (storage.getString(name) ?? null) : null;
	},
	removeItem: (name) => {
		const storage = getUserStorage();
		if (storage) storage.remove(name);
	},
};

export const globalZustandStorage: StateStorage = {
	setItem: (name, value) => globalStorage.set(name, value),
	getItem: (name) => globalStorage.getString(name) ?? null,
	removeItem: (name) => globalStorage.remove(name),
};
