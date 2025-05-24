import atomStorageService from "./services/atom-storage.service";
import { User } from "./models";

class Atoms {
  // Define atoms here
  themeAtom = atomStorageService.getAtom<string>("theme", "light");
  tokenAtom = atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = atomStorageService.getAtom<User | null>("user", null);

  // E.g. session storage atom
  // sessionAtom = atomStorageService.getAtom<string | null>(
  //   "session-atom",
  //   null,
  //   StorageType.SESSION
  // );
}

export default new Atoms();
