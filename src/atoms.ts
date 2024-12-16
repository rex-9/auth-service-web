import AtomStorageService from "./services/atomStorageService";
import { IUser } from "./types";

class Atoms {
  private atomStorageService = new AtomStorageService();

  // Define atoms here
  themeAtom = this.atomStorageService.getAtom<string>("theme", "light");
  tokenAtom = this.atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = this.atomStorageService.getAtom<IUser | null>("user", null);
}

export default new Atoms();
