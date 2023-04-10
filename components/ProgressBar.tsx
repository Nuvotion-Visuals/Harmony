import React from 'react'
// @ts-ignore
import NProgress from 'nprogress'
import Router from "next/router"

NProgress.configure({ showSpinner: false })
NProgress.configure({ minimum: 0.15 })

interface Props {
  color: string,
  startPosition: number,
  stopDelayMs: number,
  height: number,
  options?: object,
}

class NextNProgress extends React.Component {
  static defaultProps : Props = {
    color: 'var(--F_Primary_Variant)',
    startPosition: 0.1,
    stopDelayMs: 200,
    height: 3,
  }

  timer = null

  routeChangeStart = () => {
    NProgress.set((this.props as Props).startPosition)
    NProgress.start()
  };

  routeChangeEnd = () => {
    clearTimeout(this.timer!)
    // @ts-ignore
    this.timer = setTimeout(() => {
      NProgress.done(true)
    }, (this.props as Props).stopDelayMs)
  }

  render() {
    const { color, height } = (this.props as Props)

    return (
      <style jsx global>{`
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: ${color};
          position: fixed;
          z-index: 1031;
          top: 0px;
          left: 0;
          width: 100%;
          height: 3px;
          // box-shadow: 0 0 5px ${color}, 0 0 3px ${color};
        }
        .nprogress-custom-parent {
          overflow: hidden;
          position: relative;
        }
        .nprogress-custom-parent #nprogress .bar {
          position: absolute;
        }
      `}</style>)
  }

  componentDidMount() {
    const { options } = (this.props as Props)

    if (options) {
      NProgress.configure(options)
    }

    Router.events.on('routeChangeStart', this.routeChangeStart)
    Router.events.on('routeChangeComplete', this.routeChangeEnd)
    Router.events.on('routeChangeError', this.routeChangeEnd)
  }
}



export default NextNProgress