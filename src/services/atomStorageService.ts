import { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

class AtomStorageService {
  private atoms: Record<string, WritableAtom<any, any, void>>;

  constructor() {
    this.atoms = Object.keys(localStorage).reduce((acc, key) => {
      acc[key] = atomWithStorage<any>(
        key,
        JSON.parse(localStorage.getItem(key) as string)
      );
      return acc;
    }, {} as Record<string, WritableAtom<any, any, void>>);
  }

  getAtom<T>(key: string, initialValue: T): WritableAtom<T, any, void> {
    if (!this.atoms[key]) {
      this.atoms[key] = atomWithStorage<T>(key, initialValue);
    }
    return this.atoms[key] as WritableAtom<T, any, void>;
  }

  removeAtom(key: string): void {
    if (this.atoms[key]) {
      localStorage.removeItem(key);
      delete this.atoms[key];
    }
  }
}

export default AtomStorageService;
