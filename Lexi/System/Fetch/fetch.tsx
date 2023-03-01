import { markdownToHTML } from '@avsync.live/formation'

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
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Could not get article content.');
        }
      })
      .then(data => {
        const content = data.data.article.content;
        callback(content);
      })
      .catch(error => {
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
  