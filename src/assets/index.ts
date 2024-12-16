// Import images
import banner from "./images/banner.png";

// Import videos
import sample from "./videos/sample.mp4";

// Import icons
import insta from "./icons/instagram.svg"; // Asset icons
import { MoonIcon, SunIcon } from "./icons"; // Lib icons

// Define TypeScript interfaces
interface AssetProps {
  src: string;
  alt: string;
  title: string;
}

// Add images and icons here
const images: Record<string, AssetProps> = {
  banner: {
    src: banner,
    alt: "banner image alt",
    title: "banner image title",
  },
};

const icons: {
  asset: Record<string, AssetProps>;
  lib: Record<string, React.ComponentType>;
} = {
  asset: {
    insta: {
      src: insta,
      alt: "instagram icon alt",
      title: "instagram icon title",
    },
  },
  lib: {
    sun: SunIcon,
    moon: MoonIcon,
  },
};

const videos: Record<string, AssetProps> = {
  sample: {
    src: sample,
    alt: "sample video alt",
    title: "sample video title",
  },
};

export default { images, icons, videos };
