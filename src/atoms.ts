import atomStorageService from "./services/atom-storage.service";
import { User } from "./models";
import { Toast } from "./models/Toast";
import { atom } from "jotai";

class Atoms {
  // Define atoms here
  themeAtom = atomStorageService.getAtom<string>("theme", "light");
  tokenAtom = atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = atomStorageService.getAtom<User | null>("user", null);

  // For toasts, we should use a regular atom since we don't need persistence
  // and it will be cleared on page refresh (which is usually desired for notifications)
  toastsAtom = atom<Toast[]>([]);

  // E.g. session storage atom
  // sessionAtom = atomStorageService.getAtom<string | null>(
  //   "session-atom",
  //   null,
  //   StorageType.SESSION
  // );
}

export default new Atoms();
