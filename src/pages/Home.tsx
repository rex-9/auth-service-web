import { SignOutBtn, VideoPlayer, Asset, Typography } from "../components";
import PageLayout from "./PageLayout";
import { useAuth } from "../contexts";
import assets from "../assets";
import { LocaleKeys } from "../locales/locales";
import { useTranslation } from "react-i18next";
// import { useEffect } from "react";
// import { api } from "../services/api";
// import AppRoutes from "../AppRoutes";

function Home() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  // Protected Api Call just for testing
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

  // console.log("currentUser ===>", currentUser);

  return (
    <PageLayout>
      {<Asset asset={assets.icons.insta} className="w-8" />}
      {<Asset asset={assets.images.banner} className="w-96" />}
      <Typography className="text-xl font-bold" variant="primary">
        {t(LocaleKeys.Home)}
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
}

export default Home;
