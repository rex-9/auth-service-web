import AtomStorageService from "./services/atom-storage.service";
import { User } from "./models";

class Atoms {
  private atomStorageService = new AtomStorageService();

  // Define atoms here
  themeAtom = this.atomStorageService.getAtom<string>("theme", "light");
  tokenAtom = this.atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = this.atomStorageService.getAtom<User | null>("user", null);
}

export default new Atoms();
