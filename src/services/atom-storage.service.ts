import { WritableAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export enum StorageType {
  LOCAL = "local", // Default
  SESSION = "session",
}

class AtomStorageService {
  private atoms: Record<string, WritableAtom<any, any, void>>;
  private storages: Record<StorageType, SyncStorage<any>>;

  constructor() {
    this.atoms = {};

    // Create jotai storage wrappers
    this.storages = {
      [StorageType.LOCAL]: createJSONStorage(() => localStorage),
      [StorageType.SESSION]: createJSONStorage(() => sessionStorage),
    };

    // Initialize atoms from both storage types
    this.initializeFromStorage(StorageType.LOCAL);
    this.initializeFromStorage(StorageType.SESSION);
  }

  private initializeFromStorage(type: StorageType): void {
    const storage = this.storages[type];

    Object.keys(storage).forEach((key) => {
      try {
        const value = JSON.parse(storage.getItem(key, null) as string);
        const atomKey = this.getAtomKey(key, type);
        this.atoms[atomKey] = this.createAtom(key, value, type);
      } catch (error) {
        console.error(`Error parsing ${type} storage key "${key}":`, error);
      }
    });
  }

  private getAtomKey(key: string, type: StorageType): string {
    return `${type}:${key}`;
  }

  private createAtom<T>(
    key: string,
    initialValue: T,
    type: StorageType
  ): WritableAtom<T, [T], void> {
    return atomWithStorage<T>(
      key,
      initialValue,
      this.storages[type] as SyncStorage<T>
    );
  }

  getAtom<T>(
    key: string,
    initialValue: T,
    type: StorageType = StorageType.LOCAL
  ): WritableAtom<T, [T], void> {
    const atomKey = this.getAtomKey(key, type);

    if (!this.atoms[atomKey]) {
      this.atoms[atomKey] = this.createAtom(key, initialValue, type);
    }

    return this.atoms[atomKey] as WritableAtom<T, [T], void>;
  }

  removeAtom(key: string, type: StorageType = StorageType.LOCAL): void {
    const atomKey = this.getAtomKey(key, type);
    const storage = this.storages[type];

    if (this.atoms[atomKey]) {
      storage.removeItem(key);
      delete this.atoms[atomKey];
    }
  }
}

export default new AtomStorageService();
