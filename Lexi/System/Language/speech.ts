



// @ts-ignore
import { convert } from 'html-to-text'

let audioBuffers: AudioBuffer[] = []
let source: any

/**
 * Normalizes and tokenizes a string of text and synthesizes it into speech using the Lexi Studio TTS API.
 *
 * @remarks
 * This method is part of the Speech subsystem.
 *
 * @param text - The text to synthesize into speech
 * @param callback - The callback to call when speech synthesis is complete, or an error occurs
 * @returns void
 *
 */
export async function speak(text: string, callback: (error: any) => void) {
  // Reset the audio buffer array
  audioBuffers = []

  // If the text is empty, stop any current audio and return
  if (text === '') {
    if (source) {
      source.stop()
    }
    return
  }

  // Normalize the text: This means to convert the text into a standardized format, such as plaintext, in order to make it easier to process.
  const normalizedText = convert(text)

  // Tokenize the text: This means to split the text into smaller units, such as words or sentences, in order to analyze or process it more easily.
  const sentences = normalizedText.split('. ').filter((sentence : string) => sentence ! === '' || sentence !== '. ')

  let firstRequestCompleted = false
  try {
    // Request audio for each sentence and add it to the audio buffer array
    for (const sentence of sentences) {
      const audioBuffer = await ttsRequest(sentence)
      audioBuffers.push(audioBuffer)

      // If this is the first sentence being processed, start speaking immediately after audio generation is complete
      if (!firstRequestCompleted) {
        speakSentences(() => {
          callback(null)
        })
        firstRequestCompleted = true
      }
    }
  } catch (error) {
    callback(error)
  }
}

let audioCtx: any

/**
 * Sends a request to the Lexi Studio TTS API for the given text and returns the response as an AudioBuffer.
 *
 * @remarks
 * This method is part of the Speech subsystem.
 *
 * @param text - The text to generate audio for
 * @returns A promise that resolves with an AudioBuffer containing the audio data for the given text
 *
 */
async function ttsRequest(text: string): Promise<AudioBuffer> {
  // If audio context does not exist, create a new one
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  // Request audio from the Lexi Studio TTS API for the given text
  const response = await fetch(`https://tts.lexi.studio/tts?text=${text}.`)

  // Convert the response to an array buffer and decode it into an AudioBuffer
  const arrayBuffer = await response.arrayBuffer()
  return audioCtx.decodeAudioData(arrayBuffer)
}

/**
 * Synthesizes the audio buffers in the audioBuffers array and plays them in sequence using the Web Audio API.
 *
 * @remarks
 * This method is part of the Speech subsystem.
 *
 * @param callback - The callback to call when all audio buffers have been played
 * @returns void
 *
 */
const speakSentences = (callback : () => void) => {
  let index = 0

  const speakSentence = () => {
    // If all sentences have been spoken, call the callback and return
    if (index >= audioBuffers.length) {
      callback()
      return
    }

    // Stop any current audio and create a new buffer source node with the next audio buffer
    if (source) {
      source.stop()
    }
    const audioBuffer = audioBuffers[index]
    source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)

    // Set the onended event handler to speak the next sentence and start speaking the current sentence
    source.onended = speakSentence
    source.start()
    index++
  }

  // Start speaking the first sentence
  speakSentence()
}

type Sentence = string;
type Callback = () => void;
interface QueueManager {
  add: (sentence: Sentence) => void;
}

const createQueueManager = (): QueueManager => {
  const queue: Sentence[] = [];
  let isProcessing = false;

  const processSentence = async (sentence: Sentence, callback: Callback): Promise<void> => 
    new Promise(resolve => {
      speak(sentence, () => {
        callback()
        resolve()
      })
    });

  const processQueue = (): void => {
    isProcessing = true;
    const next = () => {
      if (queue.length > 0) {
        const sentence = queue.shift()!;
        processSentence(sentence, next);
      } else {
        isProcessing = false;
      }
    };
    next();
  };

  const add = (sentence: Sentence): void => {
    queue.push(sentence);
    if (!isProcessing) {
      processQueue();
    }
  };

  return { add };
};
const queueManager = createQueueManager();

let accumulatedSentences: string[] = [];

function handleProgress(input: string): void {
  // Split the input into sentences and loop over them
  const sentences = input.match(/[^.!?]+[.!?]+/g);
  if (sentences) {
    for (const sentence of sentences) {
      // Trim leading and trailing whitespace from the sentence
      const trimmedSentence = sentence.trim();
      if (trimmedSentence === '') {
        // Ignore empty sentences
        continue;
      }
  
      // Check if the sentence has already been logged
      if (!accumulatedSentences.includes(trimmedSentence)) {
        queueManager.add(trimmedSentence)
  
        // Add the sentence to the list of logged sentences
        accumulatedSentences.push(trimmedSentence);
      }
    }
  }
  
}

export const speakStream = (text: string, isComplete: boolean) => {
  // todo: make sentence currently being spoken available to UI for highlighting
  // todo: add onComplete callback 
  // todo: associate with message GUID to tie playback to specific message
  // todo: add new sentences to audio buffer as soon as they are available for seemless speech
  // todo: speak responses that happen not to include periods
  // todo: do not speak unpronouncable characters like backticks
  // todo: add function annotations
  // todo: convert to es6 arrow functions
  // todo: improve regex to properly say website domains and titles (Mr. Ms.)
  handleProgress(text)
}