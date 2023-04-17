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


interface Heading {
  level: number;
  text: string;
  id: string;
}

export function generateTableOfContents(htmlString: string): string {
  const headings: Heading[] = [];

  // Find all the headings in the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const headingElements = doc.querySelectorAll("h2, h3, h4, h5, h6");

  headingElements.forEach((headingElement) => {
    const level = parseInt(headingElement.tagName.slice(1));
    const text = headingElement.textContent!;
    const id = headingElement.getAttribute("id")!;

    headings.push({ level, text, id });
  });

  // Generate the table of contents
  let toc = "<ul>";

  headings.forEach((heading, index) => {
    if (index === 0 || heading.level === 1) {
      // Add the heading to the table of contents
      toc += `<li><a href="#${heading.id}">${heading.text}</a></li>`;
    } else {
      // Check if the previous heading was a sibling or a parent
      const previousHeading = headings[index - 1];

      if (previousHeading.level < heading.level) {
        // The previous heading was a parent, so start a new sublist
        toc += "<ul>";
      } else if (previousHeading.level > heading.level) {
        // The previous heading was a sibling or a child, so end the previous sublist
        const difference = previousHeading.level - heading.level;
        toc += "</li>".repeat(difference) + "</ul></li>";
      } else {
        // The previous heading was a sibling, so end the previous list item
        toc += "</li>";
      }

      // Add the heading to the table of contents
      toc += `<li><a href="#${heading.id}">${heading.text}</a>`;
    }
  });

  // End any remaining sublists
  toc += "</li></ul>".repeat(headings.filter((h) => h.level !== 1).length);

  toc += "</ul>";

  return toc;
}
