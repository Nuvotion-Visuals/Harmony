import { store } from 'redux-tk/store'

// @ts-ignore
import { convert } from 'html-to-text'

let audioCtx: any
let audioBuffers: AudioBuffer[] = []
let audioBufferSentences: string[] = []
let source: any

/**
 * Sends a request to the Lexi Studio TTS API for the given text and returns the response as an AudioBuffer.
 *
 * @param text - The text to generate audio for
 * @returns A promise that resolves with an AudioBuffer containing the audio data for the given text
 */
async function ttsRequest(text: string): Promise<AudioBuffer> {
  if (!audioCtx) { audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)() }
  const response = await fetch(`${process.env.NEXT_PUBLIC_LEXITTS_URL || 'http://localhost:1621'}/tts?text=${text}.`)
  const arrayBuffer = await response.arrayBuffer()
  return audioCtx.decodeAudioData(arrayBuffer)
}

/**
 * Synthesizes the audio buffers in the audioBuffers array and plays them in sequence using the Web Audio API.
 *
 * @param callback - The callback to call when all audio buffers have been played
 * @returns void
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
    const sentence = audioBufferSentences[index]
    source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)

    // Set the onended event handler to speak the next sentence and start speaking the current sentence
    source.onended = speakSentence
    source.start()
    console.log(sentence.replace(/\n|\r/g, " "))

    store.dispatch({
      type: 'lexi/set_currentlySpeaking',
      payload: sentence.replace(/\n|\r/g, " ")
    })

    index++
  }

  // Start speaking the first sentence
  speakSentence()
}

/**
 * Normalizes and tokenizes a string of text and synthesizes it into speech using the Lexi Studio TTS API.
 *
 * @param text - The text to synthesize into speech
 * @param callback - The callback to call when speech synthesis is complete, or an error occurs
 * @returns void
 */
export const speak = async (text: string, callback: (error: any) => void) => {
  // Reset the audio buffer array
  audioBuffers = []
  audioBufferSentences = []

  // If the text is empty, stop any current audio and return
  if (text === '' && source) {
    source.stop()
    return
  }

  // Normalize the text: This means to convert the text into a standardized format, such as plaintext, in order to make it easier to process.
  const normalizedText = convert(text)

  // Tokenize the text: This means to split the text into smaller units, such as words or sentences, in order to analyze or process it more easily.
  const sentences = normalizedText.split('. ').filter((sentence : string) => sentence ! === '' || sentence !== '. ')

  let firstRequestCompleted = false
  try {
    // Request audio for each sentence and addToSpeechQueue it to the audio buffer array
    for (const sentence of sentences) {
      const audioBuffer = await ttsRequest(sentence)
      audioBuffers.push(audioBuffer)
      audioBufferSentences.push(sentence)

      // If this is the first sentence being processed, start speaking immediately after audio generation is complete
      if (!firstRequestCompleted) {
        speakSentences(() => {
          callback(null)
          store.dispatch({
            type: 'lexi/set_currentlySpeaking',
            payload: ''
          })
        })
        firstRequestCompleted = true
      }
    }
  } 
  catch (error) {
    callback(error)
  }
}

let queue: string[] = [];
let isProcessing = false;

const processSpeechQueue = (): void => {
  isProcessing = true;
  const next = () => {
    if (queue.length > 0) {
      const combineSentences = queue.reduce((prev, curr) => prev + ' ' + curr, '');
      speak(combineSentences, next)
      queue = []
    } 
    else {
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
  // Split the input into sentences and loop over them
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  console.log(sentences)
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
        addToSpeechQueue(trimmedSentence)
  
        // Add the sentence to the list of logged sentences
        accumulatedSentences.push(trimmedSentence);
      }
    }
  }
}