import { SignOutBtn, VideoPlayer, Asset, Typography } from "../components";
import PageLayout from "./PageLayout";
import { useAuth } from "../contexts";
import assets from "../assets";
import { AppLocales } from "../locales/app_locales";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { userController } from "../controllers";

const Home: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { t } = useTranslation();

  // No need just for the sample
  useEffect(() => {
    userController.getCurrentUser(setCurrentUser);
  }, [setCurrentUser]);

  return (
    <PageLayout>
      {<Asset asset={assets.icons.asset.insta} className="w-8" />}
      {<Asset asset={assets.images.banner} className="w-96" />}
      <Typography className="text-xl font-bold" variant="primary">
        {t(AppLocales.Home)}
      </Typography>
      {currentUser && <p>Welcome, {currentUser.email}!</p>}
      <VideoPlayer
        video={assets.videos.sample}
        controls={true}
        autoplay={false}
        muted={false}
        className="w-96"
        // width="640px"
        // height="360px"
      />
      <SignOutBtn />
    </PageLayout>
  );
};

export default Home;
