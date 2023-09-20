import { RefObject } from 'react'

export const scrollToBottom = (scrollContainerRef: RefObject<HTMLElement>): void => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
  }
};

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

export class JsonValidator {
  private lastValidJson: string

  constructor() {
    this.lastValidJson = ''
  }

  public ensureValidJson(str: string): string | null {
    try {
      if (str === 'null') {
        return this.lastValidJson
      }
      JSON.parse(str)
      this.lastValidJson = str
      return str
    } catch (error) {
      let repairedString = str
      let stack: string[] = []
      let withinString = false

      for (let i = 0; i < str.length; i++) {
        const char = str[i]

        if (char === '"' && (i === 0 || str[i - 1] !== '\\')) {
          withinString = !withinString
        }

        if (!withinString) {
          if (char === '{' || char === '[') {
            stack.push(char)
          } else if (char === '}' || char === ']') {
            const lastOpen = stack.pop()
            if (
              (char === '}' && lastOpen !== '{')
              || (char === ']' && lastOpen !== '[')
            ) {
              if (lastOpen) stack.push(lastOpen)
              return this.lastValidJson
            }
          }
        }
      }

      if (withinString) {
        repairedString += '"'
      }

      while (stack.length > 0) {
        const lastOpen = stack.pop()
        if (lastOpen === '{') {
          repairedString += '}'
        } else if (lastOpen === '[') {
          repairedString += ']'
        }
      }

      try {
        JSON.parse(repairedString)
        this.lastValidJson = repairedString
        return repairedString
      } catch (finalError) {
        return this.lastValidJson
      }
    }
  }

  public parseJsonProperty(response: string | null, propertyName: string): string | null {
    const safeJsonString = this.ensureValidJson(response || '') || '{}'
    const parsedObject = JSON.parse(safeJsonString)
    return parsedObject?.[propertyName] || null
  }  
}
