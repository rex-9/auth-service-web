// Import images
import banner from "./images/banner.png";

// Import videos
import sample from "./videos/sample.mp4";

// Import icons
import insta from "./icons/instagram.svg";
import tipLightBulb from "./icons/tip_light_bulb.svg";

// Define TypeScript interfaces
export interface IAsset {
  src: string;
  alt: string;
  title: string;
}

// Add images and icons here
const images: Record<string, IAsset> = {
  banner: {
    src: banner,
    alt: "banner image alt",
    title: "banner image title",
  },
};

const icons: {
  asset: Record<string, IAsset>;
} = {
  asset: {
    insta: {
      src: insta,
      alt: "instagram icon alt",
      title: "instagram icon title",
    },
    tipLightBulb: {
      src: tipLightBulb,
      alt: "tip light bulb icon alt",
      title: "tip light bulb icon title",
    },
  },
};

const videos: Record<string, IAsset> = {
  sample: {
    src: sample,
    alt: "sample video alt",
    title: "sample video title",
  },
};

export default { images, icons, videos };
