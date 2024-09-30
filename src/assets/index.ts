// Import images
import banner from "./images/banner.png";

// Import icons
import insta from "./icons/instagram.svg";

// Import videos
import sample from "./videos/sample.mp4";

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

const icons: Record<string, AssetProps> = {
  insta: {
    src: insta,
    alt: "instagram icon alt",
    title: "instagram icon title",
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
