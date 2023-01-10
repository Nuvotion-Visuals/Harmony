import { FAVICON_BASE_PATH } from "utils/constants";

type Bookmark = {
  icon: string;
  name: string;
  url: string;
};

export const bookmarks: Bookmark[] = [
  {
    icon: 'https://lexi.studio/assets/lexi-circle.png',
    name: "Lexi.studio",
    url: "https://lexi.studio/",
  },
  {
    icon: 'https://frameworks.lexi.studio/favicon.ico',
    name: "Frameworks",
    url: "https://frameworks.lexi.studio/admin",
  },
  {
    icon: 'https://avsync.live/favicon.ico',
    name: "AVsync.LIVE",
    url: "https://avsync.live/",
  },
  {
    icon: 'https://api.avsync.live/uploads/avsync_mosh_16b3c21519.png',
    name: "Mosh",
    url: "https://avsync.live/mosh",
  },
  {
    icon: 'https://invoke.lexi.studio/assets/logo.13003d72.png',
    name: "Invoke AI",
    url: "https://invoke.lexi.studio",
  },
  {
    icon: 'https://www.photopea.com/promo/icon512.png',
    name: "Photopea",
    url: "https://photopea.com",
  },
  {
    icon: 'https://editor.graphite.rs/favicon.ico',
    name: "Graphite",
    url: "https://editor.graphite.rs/",
  },
  {
    icon: "https://www.google.com/favicon.ico",
    name: "Google",
    url: "https://www.google.com/webhp?igu=1",
  },
  {
    icon: 'https://etymonline.com/favicon.ico',
    name: "Etymology",
    url: "https://etymonline.com/",
  },
  {
    icon: "https://www.wikipedia.org/favicon.ico",
    name: "Wikipedia",
    url: "https://www.wikipedia.org/",
  },
  {
    icon: 'https://formation-ui.netlify.app/favicon.ico',
    name: "Formation",
    url: "https://formation-ui.netlify.app/",
  },
  {
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png',
    name: "Code",
    url: "https://code.lexi.studio",
  },
  {
    icon: 'https://svgco.de/favicon.png',
    name: "SVGcode",
    url: "https://svgco.de",
  },
];

export const config = {
  referrerPolicy: "no-referrer" as React.HTMLAttributeReferrerPolicy,
  sandbox:
    "allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-fullscreen",
};

export const HOME_PAGE = "https://lexi.studio";
