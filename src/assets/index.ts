// src/assets/index.ts

// ============================================================
// IMPORT ASSETS
// ============================================================

// Images & Design Textures
import banner from "./images/banner.png";
import darkBrickWall from "./design/dark-brick-wall.png";
import spotCursor from "./design/spot48.png";
import loadingImg from "./images/loading.png";
import errorImg from "./images/error.png";

// Social / UI SVGs
import angellistSvg from "./design/angellist.svg";
import facebookSvg from "./design/facebook.svg";
import githubSvg from "./design/github.svg";
import linkedinSvg from "./design/linkedin.svg";
import mediumSvg from "./design/medium.svg";
import twitterSvg from "./design/twitter.svg";
import instagramIcon from "./icons/instagram.svg";
import googleIcon from "./icons/google.svg";
import rexoneLogoSvg from "./icons/rexone-logo.svg";

// Projects Images (RexOne Repos Only)
import rexoneCoreImg from "./images/rexone-core.jpg";
import rexoneWebImg from "./images/rexone-web.jpg";
import rexoneMobileImg from "./images/rexone-mobile.jpg";

// Icons (Library components - Heroicons, Lucide, etc.)
import {
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  HeartIcon,
  LanguageIcon,
  UserIcon,
  HomeIcon,
  ArrowPathIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  Bars3Icon,
  BellIcon,
  ArrowRightStartOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  InboxStackIcon,
  KeyIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  MicrophoneIcon,
  StopIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

// Videos
import sampleVideo from "./videos/sample.mp4";

// Sounds
import noteSound from "./sounds/note.mp3";

// ============================================================
// IMAGE ASSETS (for Asset component)
// ============================================================

export const images = {
  banner: { src: banner, alt: "Banner image", title: "Rexone Banner" },
  darkBrickWall: {
    src: darkBrickWall,
    alt: "Dark Brick Wall",
    title: "Dark Brick Wall Texture",
  },
  spotCursor: { src: spotCursor, alt: "Spot Cursor", title: "Laser Cursor" },
  loading: { src: loadingImg, alt: "Loading...", title: "Loading Media" },
  error: {
    src: errorImg,
    alt: "Failed to load image",
    title: "Image Load Failed",
  },
} as const;

// ============================================================
// PROJECT ASSETS (RexOne Ecosystem Only)
// ============================================================

export const projectImages = {
  rexoneCore: { src: rexoneCoreImg, alt: "RexOne Core", title: "RexOne Core" },
  rexoneWeb: { src: rexoneWebImg, alt: "RexOne Web", title: "RexOne Web" },
  rexoneMobile: {
    src: rexoneMobileImg,
    alt: "RexOne Mobile",
    title: "RexOne Mobile",
  },
} as const;

// ============================================================
// ICON ASSETS (for Asset component)
// ============================================================

export const icons = {
  logo: { src: rexoneLogoSvg, alt: "Rexone Logo", title: "Rexone" },
  rexoneLogo: { src: rexoneLogoSvg, alt: "Rexone Logo", title: "Rexone" },
  instagram: { src: instagramIcon, alt: "Instagram icon", title: "Instagram" },
  google: { src: googleIcon, alt: "Google icon", title: "Google" },
  github: { src: githubSvg, alt: "GitHub", title: "GitHub" },
  linkedin: { src: linkedinSvg, alt: "LinkedIn", title: "LinkedIn" },
  angellist: { src: angellistSvg, alt: "AngelList", title: "AngelList" },
  medium: { src: mediumSvg, alt: "Medium", title: "Medium" },
  twitter: { src: twitterSvg, alt: "Twitter / X", title: "Twitter / X" },
  facebook: { src: facebookSvg, alt: "Facebook", title: "Facebook" },
} as const;

// ============================================================
// VIDEO ASSETS (for Video component)
// ============================================================

export const videos = {
  sample: { src: sampleVideo, alt: "Sample video", title: "Sample Video" },
} as const;

// ============================================================
// SOUND ASSETS
// ============================================================

export const sounds = {
  note: { src: noteSound, alt: "Note sound", title: "Note" },
} as const;

// ============================================================
// ICON LIBRARY COMPONENTS (for direct use)
// ============================================================

export const iconsLib = {
  sun: SunIcon,
  moon: MoonIcon,
  check: CheckCircleIcon,
  warning: ExclamationCircleIcon,
  error: XCircleIcon,
  heart: HeartIcon,
  language: LanguageIcon,
  user: UserIcon,
  home: HomeIcon,
  arrowPath: ArrowPathIcon,
  minusCircle: MinusCircleIcon,
  pencilSquare: PencilSquareIcon,
  trash: TrashIcon,
  plus: PlusIcon,
  bell: BellIcon,
  logout: ArrowRightStartOnRectangleIcon,
  checkr: CheckIcon,
  bellAlert: BellAlertIcon,
  chatBubbleLeftRight: ChatBubbleLeftRightIcon,
  cube: CubeIcon,
  inboxStack: InboxStackIcon,
  key: KeyIcon,
  userGroup: UserGroupIcon,
  archiveBox: ArchiveBoxIcon,
  feedback: ChatBubbleBottomCenterTextIcon,
  chat: ChatBubbleLeftRightIcon,
  menu: Bars3Icon,
  close: XMarkIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  chevronUpDown: ChevronUpDownIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  info: InformationCircleIcon,
  search: MagnifyingGlassIcon,
  filter: FunnelIcon,
  moreVertical: EllipsisVerticalIcon,
  upload: ArrowUpTrayIcon,
  download: ArrowDownTrayIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  mail: EnvelopeIcon,
  lock: LockClosedIcon,
  sparkles: SparklesIcon,
  document: DocumentTextIcon,
  banknotes: BanknotesIcon,
  chartBar: ChartBarIcon,
  shieldCheck: ShieldCheckIcon,
  clock: ClockIcon,
  microphone: MicrophoneIcon,
  stop: StopIcon,
  speaker: SpeakerWaveIcon,
  play: PlayIcon,
  photo: PhotoIcon,
} as const;
