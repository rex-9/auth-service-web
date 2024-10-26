import { localStorageService, userService } from "../services";
import { IUser } from "../types/modelTypes";

class UserController {
  async getCurrentUser(
    setCurrentUser: (user: IUser | null) => void
  ): Promise<void> {
    try {
      const response = await userService.getCurrentUser();
      const user = response.data?.data?.user;
      if (user) {
        localStorageService.setItem<IUser>("user", user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }
}

export default new UserController();
