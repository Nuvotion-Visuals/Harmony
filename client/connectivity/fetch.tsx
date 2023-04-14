// @ts-nocheck
import html2plaintext from 'html2plaintext'

interface ArticleContent {
  url: string;
  title: string;
  description: string;
  author: string;
  source: string;
  published: string;
  links: string[];
  image: string;
  content: string;
}
/**
 * Calls the /tools/parse-article endpoint to get the transcript of an article
 * @param contentUrl The URL of the article to parse
 * @param callback The function to call with the transcript if successful
 * @param errorCallback The function to call if an error occurs
 */

export const getArticleContent = (
  contentUrl: string,
  callback: (content: string) => void,
  errorCallback: (error: Error) => void
): void => {
  fetch('/tools/parse-article', {
    method: 'POST',
    body: JSON.stringify({ contentUrl }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Could not get article content.');
      }
    })
    .then((data) => {
      const content = data.data.article;
      const articleContent: ArticleContent = {
        url: content.url,
        title: content.title,
        description: content.description,
        author: content.author,
        source: content.source,
        published: content.published,
        links: content.links,
        image: content.image,
        content: content.content,
      };

      const builder = (fieldName: string, value: string) => {
        return value ? `<p><strong>${fieldName}:</strong> ${value}</p>` : '';
      };


      const linkHtml = articleContent.links
        .map((link) => `<a href="${link}">${link}</a>`)
        .join(', ');

      const metadataHtml = `
        ${builder('Author', articleContent.author)}
        ${builder('Source', `<a href="${articleContent.url}">${articleContent.source}</a>`)}
        ${builder('Published', articleContent.published ? new Date(articleContent.published).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) : null)}
        ${builder('Links', linkHtml)}
        ${builder('Image', `<img src="${articleContent.image}" alt="${articleContent.title}" />`)}
      `;

      const articleHtml = `
        <div>
          <h1>${articleContent.title}</h1>
          ${metadataHtml}
          ${articleContent.content}
        </div>
      `;

      callback(articleHtml);
    })
    .catch((error) => {
      console.log(error);
      errorCallback(error);
    });
};


  /**
   * Calls the /tools/parse-youtube-video endpoint to get the transcript of a YouTube video
   * @param videoUrl The URL of the YouTube video to parse
   * @param callback The function to call with the transcript if successful
   * @param errorCallback The function to call if an error occurs
   */
  export const getYouTubeTranscript = (
    videoUrl: string,
    callback: (transcript: string) => void,
    errorCallback: (error: Error) => void
  ): void => {
    fetch('/tools/parse-youtube-video', {
      method: 'POST',
      body: JSON.stringify({ videoUrl }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Could not get YouTube transcript.');
        }
      })
      .then(data => {
        const transcript = data?.data?.transcript || '';
        callback(transcript);
      })
      .catch(error => {
        console.log(error);
        errorCallback(error);
      });
  };
  
  export const insertContentByUrl = (url: string, callback: (data: string) => void) => {
    const youtubeDomains = ['m.youtube.com', 'www.youtube.com', 'youtube.com', 'youtu.be']
    const { hostname } = new URL(url);
    if (youtubeDomains.includes(hostname)) {
      getYouTubeTranscript(url,
        (transcript) => {
          callback(html2plaintext(transcript))
        },
        () => {
          alert('Sorry, I could not get the video transcript.')
        }
      )
    }
    else {
      getArticleContent(url, 
        (content) => {
          callback(content)
        },
        () => {
          alert('Sorry, I could not get the page content.')
        }
      )
    }
  }