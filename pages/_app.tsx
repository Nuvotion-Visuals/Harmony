import type { AppProps } from 'next/app'
import React from 'react'

import '@avsync.live/formation/dist/index.dark.css'

import '../styles/globals.css'

// fontawesome
import '@fortawesome/fontawesome-svg-core/styles.css'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import * as far from '@fortawesome/free-regular-svg-icons'
import * as fas from '@fortawesome/free-solid-svg-icons'
library.add(
  // regular
  // @ts-ignore
  far.faHeart, far.faPaperPlane, far.faCheckSquare, far.faSquare,
  fas.faEnvelope, far.faCopy, far.faClock, far.faBookmark,
  far.faEnvelope, 
  

  // solid
  fas.faInfoCircle, fas.faBars, fas.faHeart, fas.faPlus,
  fas.faEllipsisV, fas.faPaperPlane, fas.faCalendarAlt,
  fas.faArrowRight, fas.faArrowLeft, fas.faClock, fas.faSearch,
  fas.faSortAlphaUp, fas.faSortAlphaDown, fas.faFilter,
  fas.faChevronCircleRight, fas.faChevronCircleLeft, fas.faEnvelope,
  fas.faCheck, fas.faExclamationTriangle, fas.faUser, fas.faComment,
  fas.faComments, fas.faMessage, fas.faComments, fas.faBook, 
  fas.faQuestionCircle, fas.faNewspaper, fas.faInfo, fas.faQuestion,
  fas.faLightbulb, fas.faFolder, fas.faCopy, fas.faBookmark, fas.faShare,
  fas.faDownload, fas.faFileDownload, fas.faRefresh, fas.faSync, fas.faSyncAlt,
  fas.faPlay, fas.faMicrophone, fas.faMicrophoneSlash, fas.faStop
)

config.autoAddCss = false

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default App