import { FAVICON_BASE_PATH } from "utils/constants";

type Bookmark = {
  icon: string;
  name: string;
  url: string;
};

export const bookmarks: Bookmark[] = [
  {
    icon: FAVICON_BASE_PATH,
    name: "Lexi.studio",
    url: "http://localhost:1618/",
  },
  {
    icon: FAVICON_BASE_PATH,
    name: "AVsync.LIVE",
    url: "https://avsync.live/",
  },
  {
    icon: FAVICON_BASE_PATH,
    name: "Mosh",
    url: "https://avsync.live/mosh",
  },
  {
    icon: FAVICON_BASE_PATH,
    name: "Invoke AI",
    url: "http://localhost:7860",
  },
  {
    icon: FAVICON_BASE_PATH,
    name: "Photopea",
    url: "https://photopea.com",
  },
  {
    icon: FAVICON_BASE_PATH,
    name: "Frameworks",
    url: "http://localhost:1620/admin",
  },
  {
    icon: "/System/Icons/Favicons/google.webp",
    name: "Google",
    url: "https://www.google.com/webhp?igu=1",
  },
  {
    icon: "/System/Icons/Favicons/wikipedia.webp",
    name: "Wikipedia",
    url: "https://www.wikipedia.org/",
  },
  {
    icon: "/System/Icons/Favicons/archive.webp",
    name: "Internet Archive",
    url: "https://archive.org/",
  },
  {
    icon: "/System/Icons/Favicons/win96.webp",
    name: "Windows 96",
    url: "https://windows96.net/",
  },
  {
    icon: "/System/Icons/Favicons/aos.webp",
    name: "AaronOS",
    url: "https://aaronos.dev/",
  }
];

export const config = {
  referrerPolicy: "no-referrer" as React.HTMLAttributeReferrerPolicy,
  sandbox:
    "allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-fullscreen",
};

export const HOME_PAGE = "http://localhost:1618";
