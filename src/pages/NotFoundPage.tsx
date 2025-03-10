import AppRoutes from "../AppRoutes";
import { TextLink } from "../components";
import { useAuth } from "../contexts";
import PageLayout from "./PageLayout";
import { useLocalization } from "../hooks";

const NotFoundPage: React.FC = () => {
  const { token } = useAuth();
  const { AppLocales } = useLocalization();

  return (
    <PageLayout>
      404 Not Found
      <TextLink
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

export default NotFoundPage;
