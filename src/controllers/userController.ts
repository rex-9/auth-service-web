import { userService } from "../services";
import { IUser } from "../types/modelTypes";

class UserController {
  async getCurrentUser(
    setCurrentUser: (user: IUser | null) => void
  ): Promise<void> {
    try {
      const response = await userService.getCurrentUser();
      const user = response.data?.data?.user;
      setCurrentUser(user || null);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }
}

export default new UserController();
