import { WritableAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

class AtomStorageService {
  private atoms: Record<string, WritableAtom<any, any, void>>;
  private storage = createJSONStorage(() => sessionStorage);

  constructor() {
    this.atoms = Object.keys(sessionStorage).reduce((acc, key) => {
      try {
        const value = JSON.parse(sessionStorage.getItem(key) as string);
        acc[key] = atomWithStorage<any>(key, value, this.storage);
      } catch (error) {
        console.error(`Error parsing sessionStorage key "${key}":`, error);
      }
      return acc;
    }, {} as Record<string, WritableAtom<any, any, void>>);
  }

  getAtom<T>(key: string, initialValue: T): WritableAtom<T, [T], void> {
    if (!this.atoms[key]) {
      this.atoms[key] = atomWithStorage<T>(
        key,
        initialValue,
        this.storage as SyncStorage<T>
      );
    }
    return this.atoms[key] as WritableAtom<T, [T], void>;
  }

  removeAtom(key: string): void {
    if (this.atoms[key]) {
      sessionStorage.removeItem(key);
      delete this.atoms[key];
    }
  }
}

export default AtomStorageService;
