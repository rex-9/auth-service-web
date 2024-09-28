import { SignOutBtn } from "../components";
import PageLayout from "./PageLayout";
import LocalStorageService from "../services/LocalStorageService";
import { User } from "../models";
// import { useEffect } from "react";
// import { api } from "../services/api";
// import AppRoutes from "../AppRoutes";

function Home() {
  const user: User | null = LocalStorageService.getItem<User>("user");

  // Protected Api Call
  // useEffect(() => {
  //   const getCurrentUser = async () => {
  //     const response = await api.get<{
  //       status: {
  //         code: number;
  //         success: boolean;
  //         message: string;
  //         error?: string;
  //       };
  //       data: { user: User; token: string };
  //     }>(AppRoutes.server.protected.GET_CURRENT_USER);
  //     console.log("response ===>", response);
  //   };
  //   getCurrentUser();
  // }, []);

  return (
    <PageLayout>
      Home
      {user && <p>Welcome, {user.email}!</p>} <SignOutBtn />
    </PageLayout>
  );
}

export default Home;
