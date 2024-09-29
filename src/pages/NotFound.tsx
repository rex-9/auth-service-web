import { Link } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { useAuth } from "../contexts";
import PageLayout from "./PageLayout";

const NotFound = () => {
  const { token } = useAuth();

  return (
    <PageLayout>
      404 Not Found
      <Link
        to={
          token
            ? AppRoutes.client.protected.HOME
            : AppRoutes.client.public.SIGN_IN
        }
      >
        Go Back
      </Link>
    </PageLayout>
  );
};

export default NotFound;
