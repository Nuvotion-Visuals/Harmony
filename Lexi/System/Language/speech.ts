// @ts-ignore
import { convert } from 'html-to-text'

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


export const speak = (text : string, onComplete: () => void) => {
  speechSynthesis.cancel()
  const sentences = convert(text).split('. ')
  for (var i=0;i< sentences.length; i++) {
    const toSay = sayit()
    toSay.text = sentences[i]
    speechSynthesis.speak(toSay)
    toSay.onend = () => {
      if (i === sentences.length) {
        onComplete()
      }
    }
  }
}