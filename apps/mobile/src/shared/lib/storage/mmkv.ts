import { createMMKV, type MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

/** App-wide MMKV instance. Always available; not tied to any user session. */
export const globalStorage = createMMKV({ id: "app-global-storage" });

/**
 * Lazily-created, per-user MMKV instance. `null` until
 * {@link initializeUserStorage} runs and back to `null` after
 * {@link clearUserStorageInstance}. All per-user access goes through this
 * singleton so storage is scoped to the currently logged-in user.
 */
let userStorageInstance: MMKV | null = null;

/**
 * Creates (or replaces) the per-user MMKV instance, namespaced by `userId`.
 * Call this once after login/session restore, before any per-user read/write.
 *
 * @param userId - Unique id used to namespace the storage (`user-<id>-storage`).
 * @returns The freshly created MMKV instance.
 */
export const initializeUserStorage = (userId: string) => {
	userStorageInstance = createMMKV({
		id: `user-${userId}-storage`,
	});
	return userStorageInstance;
};

/**
 * Returns the active per-user MMKV instance, or `null` if
 * {@link initializeUserStorage} has not been called yet.
 */
export const getUserStorage = () => userStorageInstance;

/** Drops the per-user instance reference (call on logout) so it can be re-init. */
export const clearUserStorageInstance = () => {
	userStorageInstance = null;
};

/**
 * Zustand `StateStorage` adapter bound to the **per-user** MMKV instance.
 *
 * ⚠️ Only effective after {@link initializeUserStorage} has run. Before that
 * (or after {@link clearUserStorageInstance}) every operation is a safe no-op:
 * `getItem` returns `null`, `setItem`/`removeItem` do nothing. Use this for
 * stores that must be scoped to the logged-in user.
 */
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

/**
 * Zustand `StateStorage` adapter bound to the app-wide {@link globalStorage}.
 * Always available — use this for data that is not scoped to a user.
 */
export const globalZustandStorage: StateStorage = {
	setItem: (name, value) => globalStorage.set(name, value),
	getItem: (name) => globalStorage.getString(name) ?? null,
	removeItem: (name) => globalStorage.remove(name),
};
