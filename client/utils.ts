import { RefObject } from 'react'

export const scrollToBottom = (scrollContainerRef: RefObject<HTMLElement>): void => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }
};

/**
An object containing optional properties to configure the scrolling behavior when using scrollIntoView()
@typedef {Object} ScrollOptions

@property {"auto" | "smooth"} [behavior="auto"] - Specifies the scrolling behavior to use. This can be either "auto" or "smooth".


@property {"start" | "center" | "end" | "nearest"} [block="start"] - Specifies the vertical alignment of the scrolled element within its container. This can be one of "start", "center", "end", or "nearest".

@property {"start" | "center" | "end" | "nearest"} [inline="nearest"] - Specifies the horizontal alignment of the scrolled element within its container. This can be one of "start", "center", "end", or "nearest".
 */
type ScrollOptions = {
  behavior?: "auto" | "smooth";
  block?: "start" | "center" | "end" | "nearest";
  inline?: "start" | "center" | "end" | "nearest";
}

/**
 * Scrolls smoothly to an HTML element with the specified ID using customizable behavior options.
 * @param {string} id - The ID attribute of the HTML element to scroll to.
 * @param {ScrollOptions} options - An object containing the scrolling behavior options including "behavior", "block", and "inline".
 */
export const scrollToElementById = (id: string, options: ScrollOptions) => {
  setTimeout(() => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView(options);
    } 
    else {
      console.error(`Element with ID 'top_${id}' not found.`);
    }
  }, 100);
}

