import { RefObject } from 'react'

export const getTimestamp = () : string =>
  new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})

export const scrollToBottom = (scrollContainerRef: RefObject<HTMLElement>): void => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }
};