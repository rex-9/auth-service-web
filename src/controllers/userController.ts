import { userService } from "../services";
import { IApiResponse } from "../types";
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

  async uploadImage(file: File): Promise<void> {
    try {
      const response: IApiResponse<{ url: string }> =
        await userService.uploadImage(file);
      console.log("Image uploaded:", response.data?.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
}

export default new UserController();
