import AppRoutes from "../AppRoutes";
import { LinkText } from "../components";
import { useAuth } from "../contexts";
import PageLayout from "./PageLayout";
import { LocaleKeys } from "../locales/locales";

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
        label={LocaleKeys.GoBack}
      />
    </PageLayout>
  );
};

export default NotFound;
