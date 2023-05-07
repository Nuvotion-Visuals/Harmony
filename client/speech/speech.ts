import { store } from 'redux-tk/store';
import { split } from 'sentence-splitter';

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
  let index = 0;

  const speakSentence = () => {
    if (index >= audioElements.length) {
      callback();
      return;
    }

    const audioElement = audioElements[index];
    const sentence = audioSentences[index];
    document.body.appendChild(audioElement);
    audioElement.playbackRate = 1.15;
    audioElement.play();

    store.dispatch({
      type: 'lexi/set_currentlySpeaking',
      payload: sentence.replace(/\n|\r/g, " "),
    });

    audioElement.addEventListener('ended', () => {
      document.body.removeChild(audioElement);
      index++;
      speakSentence();
    });
  };

  speakSentence();
};

export const speak = async (text: string, callback: (error: any) => void) => {
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
      type: 'lexi/set_currentlySpeaking',
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
      speak(combineSentences, next);
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