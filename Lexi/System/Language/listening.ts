/**
 * Starts listening for a wake word using the SpeechRecognition API, and invokes a callback when the wake word is detected.
 *
 * @remarks
 * This method is part of the Wake Word subsystem.
 *
 * @param {() => void} callback - The function to invoke when the wake word is detected.
 * @returns void
 */
export function listenForWakeWord(callback: () => void) {
  // @ts-ignore
  const SpeechGrammarList = window.webkitSpeechGrammarList;
  // @ts-ignore
  // Set up the SpeechRecognition object
  const recognition = new webkitSpeechRecognition()
  // Configure the recognition object to run continuously and return only final results
  recognition.continuous = true;
  recognition.interimResults = false;
  // Set the language to English (US)
  recognition.lang = 'en-US';
  
  // Set up the wake word grammar
  const wakeWord = 'Lexi';
  if (SpeechGrammarList !== undefined) {
    const speechRecognitionList = new SpeechGrammarList();

    // Define the wake word grammar using JSGF format
    const g_wakeWord = `#JSGF V1.0; grammar wakeWord; public <wake> = ${wakeWord};;`
    speechRecognitionList.addFromString(g_wakeWord, 1);
  
    // Add the wake word grammar to the recognition object's grammars list
    recognition.grammars = speechRecognitionList;
    
    // Start listening for the wake word
    recognition.start();
    // Log a message to the console indicating that the wake word is being listened for
    recognition.onended = () => 'not listening'
    // Set up the event handler for when the wake word is recognized
    recognition.onresult = (event: any) => {
      // Get the transcript of the recognized speech
      const result = event.results[0][0].transcript;
      if (result === wakeWord) {
        // Execute the callback function when the wake word is recognized
        callback();
      }
    }
  }
}