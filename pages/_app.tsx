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
  fas.faPlay, fas.faMicrophone, fas.faMicrophoneSlash, fas.faStop, fas.faFingerprint,
  fas.faBrain, fas.faPuzzlePiece, fas.faCompass, fas.faGraduationCap,
  fas.faBullseye, fas.faComments, fas.faMousePointer, fas.faMasksTheater,
  fas.faBalanceScale, fas.faTag, fas.faTrafficLight, fas.faFlask, fas.faDna,
  fas.faScroll, fas.faTimes, fas.faCubes, fas.faUsersLine,
  fas.faPeopleArrows, fas.faShieldHalved, fas.faMask,
  fas.faArrowsSplitUpAndLeft, fas.faArrowsSpin, fas.faCog,
  fas.faDiagramProject, fas.faList, fas.faBookmark

)

import App from '../components/App'
import { useRouter } from 'next/router'

config.autoAddCss = false

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  return <>
    {
      router.route === '/login'
        ? <Component {...pageProps} />
        : <App>
            <Component {...pageProps} />
          </App>
      }
  </>
}

export default MyApp