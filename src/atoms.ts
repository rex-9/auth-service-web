import { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { IUser } from "./types";

class AtomStorageService {
  private atoms: Record<string, WritableAtom<any, any, void>> = {};

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

class Atoms {
  private atomStorageService = new AtomStorageService();

  // Define atoms here
  themeAtom = this.atomStorageService.getAtom<string>("theme", "light");
  tokenAtom = this.atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = this.atomStorageService.getAtom<IUser | null>("user", null);
}

export default new Atoms();
