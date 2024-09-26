import { SignOutBtn } from "../components";
import PageLayout from "./PageLayout";
import LocalStorageService from "../services/LocalStorageService";
import { User } from "../models";

function Home() {
  const user: User | null = LocalStorageService.getItem<User>("user");

  return (
    <PageLayout>
      Home
      {user && <p>Welcome, {user.email}!</p>} <SignOutBtn />
    </PageLayout>
  );
}

export default Home;
