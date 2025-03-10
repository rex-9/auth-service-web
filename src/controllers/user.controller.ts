import { userService } from "../services";
import { IApiResponse } from "../models";
import { User } from "../models/user.model";

class UserController {
  async getCurrentUser(
    setCurrentUser: (user: User | null) => void
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
