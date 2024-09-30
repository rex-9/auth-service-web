// Import images
import banner from "./images/banner.png";

// Import icons
import insta from "./icons/instagram.svg";

// Define TypeScript interfaces
interface Asset {
  src: string;
  alt: string;
  title: string;
}

// Add images and icons here
const images: Record<string, Asset> = {
  banner: {
    src: banner,
    alt: "banner",
    title: "banner",
  },
};

const icons: Record<string, Asset> = {
  insta: {
    src: insta,
    alt: "instagram",
    title: "instagram",
  },
};

export default { images, icons };
