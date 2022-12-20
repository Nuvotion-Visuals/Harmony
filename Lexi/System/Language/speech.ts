// @ts-ignore
import { convert } from 'html-to-text'

import { customAlphabet } from 'nanoid'
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet, 11)

let currentSentenceId = null
export const speak = (text : string, onComplete: () => void) => {
  currentSentenceId = nanoid()
  const sentences = convert(text).split('. ');
  const playSentence = (i: number) => {
    if (i === sentences.length) {
      onComplete()
      return
    }
    ttsRequest(sentences[i], () => {
      playSentence(i + 1)
    })
  }
  playSentence(0)
}

let source: any
let previousText: string | null = null;
let audioCtx: AudioContext | null
function ttsRequest(text: string, onComplete: () => void) {
  previousText = text;
  audioCtx = new AudioContext();
  fetch(`http://localhost:5002/api/tts?text=${text}.`)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      if (source) {
        source.stop()
      }
      source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => {
        onComplete();
      };
      source.start();
    });
}