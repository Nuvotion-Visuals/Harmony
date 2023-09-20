import { store } from 'redux-tk/store';
import { split } from 'sentence-splitter';

let targetMessageGuid = ''

const removeOldHighlights = (html: string): string => {
  const openingTag = `<span style="background-color: #312800;">`
  const closingTag = "</span>"
  return html.replace(new RegExp(openingTag, 'g'), '').replace(new RegExp(closingTag, 'g'), '')
}

const searchAndHighlight = async (guid: string, currentlySpeaking: string | null) => {
  await new Promise(resolve => setTimeout(resolve, 50))
  const parentElement = document.getElementById(guid)

  if (!parentElement) {
    console.warn('Element with the given GUID not found.')
    return
  }

  const qlEditorElement = parentElement.querySelector('.ql-editor')

  if (!qlEditorElement) {
    console.warn('ql-editor class element not found within the parent.')
    return
  }

  let htmlContent = qlEditorElement.innerHTML
  
  // Remove old highlights
  htmlContent = removeOldHighlights(htmlContent)

  const highlightedHtml = highlightText(htmlContent, currentlySpeaking)
  
  qlEditorElement.innerHTML = highlightedHtml
  console.log('Updated HTML:', qlEditorElement.innerHTML)
}

const highlightText = (html: string, currentlySpeaking: string | null): string => {
  const openingTag = `<span style="background-color: #312800;">`
  const closingTag = '</span>'
  let len = 0
  if (currentlySpeaking) {
    len = currentlySpeaking.length
  }

  let startIndex = 0
  let index = currentlySpeaking ? html.indexOf(currentlySpeaking, startIndex) : -1
  let highlightedHtml = ''

  console.log('Initial index:', index)

  while (index !== -1) {
    highlightedHtml += html.substring(startIndex, index)
    highlightedHtml += openingTag + html.substring(index, index + len) + closingTag
    startIndex = index + len
    index = html.indexOf(currentlySpeaking as string, startIndex)
  }

  highlightedHtml += html.substring(startIndex)

  return highlightedHtml
}
let audioElements: HTMLAudioElement[] = [];
let audioSentences: string[] = [];
import { HTMLtoPlaintext } from '@avsync.live/formation';

function createAudioElement(text: string): HTMLAudioElement {
  const audioUrl = `/tts/tts?text=${encodeURIComponent(text)}`;
  const audioElement = document.createElement('audio');
  const sourceElement = document.createElement('source');
  sourceElement.src = audioUrl;
  sourceElement.type = 'audio/wav';
  audioElement.appendChild(sourceElement);
  return audioElement;
}

const speakSentences = (callback: () => void) => {
  let index = 0

  const speakSentence = () => {
    if (index >= audioElements.length) {
      // Remove highlights here, after all sentences have been spoken.
      searchAndHighlight(targetMessageGuid, null)
      callback()
      return
    }

    const audioElement = audioElements[index]
    const sentence = audioSentences[index]
    document.body.appendChild(audioElement)
    audioElement.playbackRate = 1.15
    audioElement.play()

    searchAndHighlight(targetMessageGuid, sentence.replace(/\n|\r/g, " "))

    audioElement.addEventListener('ended', () => {
      document.body.removeChild(audioElement)
      index++
      speakSentence()
    })
  }

  speakSentence()
}

export const speak = async (text: string, callback: (error: any) => void, guid: string) => {
  targetMessageGuid = guid

  audioElements = [];
  audioSentences = [];

  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`/g, '');
  text = text.replace(/#\w+/g, '')
  text = text.replace(/\[[^\]]*\]/g, '')

  if (text === '') {
    return;
  }

  const normalizedText = HTMLtoPlaintext(text);
  const splitSentences = split(normalizedText);
  const sentences = splitSentences.filter(item => item.type === 'Sentence').map(item => item.raw);
  const maxLengthSentences = sentences.flatMap(sentence => {
    if (sentence.length > 320) {
      const words = sentence.split(' ');
      const splitSentences = [];
      let currentSentence = '';
  
      words.forEach((word : string) => {
        if (currentSentence.length + word.length + 1 <= 320) {
          currentSentence += (currentSentence ? ' ' : '') + word;
        } else {
          splitSentences.push(currentSentence);
          currentSentence = word;
        }
      });
  
      if (currentSentence) {
        splitSentences.push(currentSentence);
      }
  
      return splitSentences;
    } else {
      return sentence;
    }
  });

  for (const sentence of maxLengthSentences) {
    const audioElement = createAudioElement(sentence);
    audioElements.push(audioElement);
    audioSentences.push(sentence);
  }

  speakSentences(() => {
    callback(null);
    store.dispatch({
      type: 'language/set_currentlySpeaking',
      payload: '',
    });
  });
};

let queue: string[] = [];
let isProcessing = false;

const processSpeechQueue = (): void => {
  isProcessing = true;
  const next = () => {
    if (queue.length > 0) {
      const combineSentences = queue.reduce((prev, curr) => prev + ' ' + curr, '');
      speak(combineSentences, next, targetMessageGuid);
      queue = [];
    } else {
      isProcessing = false;
    }
  };
  next();
};

const addToSpeechQueue = (sentence: string): void => {
  queue.push(sentence.replace(/#/g, ""));
  if (!isProcessing) {
    processSpeechQueue();
  }
};

let accumulatedSentences: string[] = [];

export const speakStream = (text: string, guid: string) => {
  targetMessageGuid = guid
  console.log(guid)
  // Check if the last character is a sentence-ending punctuation mark
  const lastChar = text.slice(-1);
  if (!['.', '!', '?', '\n'].includes(lastChar)) {
    return; // Return early if the input text doesn't end with a completed sentence
  }

  const splitSentences = split(text);
  const sentences = splitSentences.filter(item => item.type === 'Sentence').map(item => item.raw);

  console.log(sentences);

  if (sentences) {
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence === '') {
        continue;
      }

      // Check if the sentence has already been logged
      if (!accumulatedSentences.includes(trimmedSentence)) {
        addToSpeechQueue(trimmedSentence);
        accumulatedSentences.push(trimmedSentence);
      }
    }
  }
};