// @ts-ignore
import { convert } from 'html-to-text';

let audioBuffers: AudioBuffer[] = [];

export async function speak(text: string, callback: (error: any) => void) {
  audioBuffers = []
  const sentences = convert(text).split('. ');
  let firstRequestCompleted = false;

  try {
    for (const sentence of sentences) {
      const audioBuffer = await ttsRequest(sentence);
      audioBuffers.push(audioBuffer);
      if (!firstRequestCompleted) {
        playSentences();
        firstRequestCompleted = true;
      }
    }
    callback(null);
  } catch (error) {
    callback(error);
  }
}

let previousText: any;
let audioCtx: any;
async function ttsRequest(text: string): Promise<AudioBuffer> {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  previousText = text;
  const response = await fetch(`http://localhost:5002/api/tts?text=${text}.`);
  const arrayBuffer = await response.arrayBuffer();
  return audioCtx.decodeAudioData(arrayBuffer);
}

let source: any;

function playSentences() {
  let index = 0;

  function playNext() {
    if (index >= audioBuffers.length) {
      return;
    }
    const audioBuffer = audioBuffers[index];
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.onended = playNext;
    source.start();
    index++;
  }

  playNext();
}