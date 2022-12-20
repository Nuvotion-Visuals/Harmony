// @ts-ignore
import { convert } from 'html-to-text'

import axios from 'axios'

const sayit = () => {
  // set_speaking(true)
  // text, voice_name="default", pitch=0, rate=1
  var voices = window.speechSynthesis.getVoices();

  var msg = new SpeechSynthesisUtterance();

  msg.voice = voices[1]; // Note: some voices don't support altering params
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; //0 to 2
  msg.lang = 'en-US';
  msg.onstart = function (event) {
    console.log("started");
    // set_speaking(true)
  };
  msg.onend = function(event) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
    // set_speaking(false)
  };
  msg.onerror = function(event) {
    console.log('Errored ' + event);
    // set_speaking(false)

  }
  msg.onpause = function (event) {
    console.log('paused ' + event);
    // set_speaking(false)
  }
  msg.onboundary = function (event) {
    console.log('onboundary ' + event);
  }

  return msg;
}

export async function playText(text: string) {
  const response = await fetch(`http://localhost:5002/api/tts?text=${encodeURIComponent(text)}`);
  const data = await response.arrayBuffer();
  const audioCtx = new AudioContext();
  audioCtx.decodeAudioData(data, buffer => {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  });
}

export const speak = (text : string, onComplete: () => void) => {
  speechSynthesis.cancel();
  const sentences = convert(text).split('. ');

  const playSentence = (i: number) => {
    if (i === sentences.length) {
      onComplete();
      return;
    }
    ttsRequest(sentences[i], () => playSentence(i + 1));
  };

  playSentence(0);
}

let source: any
let previousText: string | null = null;
let audioCtx: AudioContext | null
function ttsRequest(text: string, onComplete: () => void) {
  if (text === previousText) {
    console.log(`Skipping TTS request for text: ${text}`);
    onComplete();
    return;
  }
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
        console.log('Ended:', text)
        onComplete();
      };
      source.start();
    });
}