import { useState, useRef } from "react";
import { playSound } from "./sounds";

interface Props {
  onInterimTranscript: (result: string) => void;
  onFinalTranscript: (result: string) => void;
}

export const SpeechTranscription = ({
  onInterimTranscript,
  onFinalTranscript
}: Props) => {
  const [listening, set_listening] = useState(false);
  const recognitionRef = useRef<webkitSpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");

  const listen = () => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech recognition not supported");
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onstart = () => {
        console.log("Speech Recognition Started");
      };
      recognitionRef.current.onerror = (e) => {
        console.log("Speech Recognition Error", e);
        playSound('stop-listening')
      };
      recognitionRef.current.onend = () => {
        console.log("Speech Recognition Ended");
        playSound('stop-listening')

        recognitionRef.current = null;
        set_listening(false);
      };
      recognitionRef.current.onresult = (event) => {
        let interim_transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        onFinalTranscript(finalTranscriptRef.current);
        onInterimTranscript(interim_transcript);
      };
    }
    recognitionRef.current.start();
    set_listening(true);
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const clear = () => {
    finalTranscriptRef.current = "";
  };

  return { listen, stopListening, listening, clear };
};
