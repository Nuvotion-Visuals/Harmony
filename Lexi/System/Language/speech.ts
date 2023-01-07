// @ts-ignore
import { convert } from 'html-to-text'

let audioBuffers: AudioBuffer[] = []
let source: any

export async function speak(text: string, callback: (error: any) => void) {
  audioBuffers = []
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
    for (const sentence of sentences) {
      const audioBuffer = await ttsRequest(sentence)
      audioBuffers.push(audioBuffer)
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
async function ttsRequest(text: string): Promise<AudioBuffer> {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  // const response = await fetch(`http://192.168.1.128:5500/api/tts?voice=larynx%3Aljspeech-glow_tts&lang=en&vocoder=high&denoiserStrength=.001&text=${text}.`)
  
  // much better Google Cloud TTS
  const response = await fetch(`https://tts.lexi.studio/tts?text=${text}.`)
  
  const arrayBuffer = await response.arrayBuffer()
  return audioCtx.decodeAudioData(arrayBuffer)
}

// Synthesize the text: This means to generate speech output from the text, either by using a text-to-speech engine or by playing pre-recorded audio files.
const speakSentences = (callback : () => void) => {
  let index = 0

  const speakSentence = () => {
    if (index >= audioBuffers.length) {
      callback()
      return
    }
    if (source) {
      source.stop()
    }
    const audioBuffer = audioBuffers[index]
    source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)
    source.onended = speakSentence
    source.start()
    index++
  }

  speakSentence()
}

