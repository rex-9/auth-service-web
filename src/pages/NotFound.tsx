import AppRoutes from "../AppRoutes";
import { LinkText } from "../components";
import { useAuth } from "../contexts";
import PageLayout from "./PageLayout";
import { AppLocales } from "../locales/app_locales";

const NotFound = () => {
  const { token } = useAuth();

  return (
    <PageLayout>
      404 Not Found
      <LinkText
        to={
          token
            ? AppRoutes.client.protected.HOME
            : AppRoutes.client.public.SIGN_IN
        }
        label={AppLocales.GoBack}
      />
    </PageLayout>
  );
};

export default NotFound;
