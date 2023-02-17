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

  // Check if the browser supports the SpeechRecognition API
  // @ts-ignore
  const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
  // @ts-ignore
  const SpeechRecognition = window.SpeechRecognition;
  if (!('SpeechRecognition' in window)) {
    // Log an error message to the console if the API is not supported
    console.error('Speech recognition not supported by your browser');
    return;
  }
  
  /*
  * The Speech Recognition API is a technology that provides web developers with the ability to incorporate speech recognition capabilities 
  * into web applications. It allows web applications to recognize speech input from a user's microphone and convert it to text, which can 
  * then be used for a wide range of purposes, such as controlling the application, entering text, and performing actions.
  *
  * The Speech Recognition API is widely supported by modern web browsers, including Google Chrome, Firefox, and Microsoft Edge. It is based 
  * on the Web Speech API, which is a set of interfaces that provide web developers with access to speech synthesis and recognition 
  * capabilities in the browser.
  *
  * The Speech Recognition API works by first setting up a speech recognition object, configuring its properties, and attaching event 
  * handlers to it. The properties of the speech recognition object include settings such as the language to recognize, the maximum 
  * number of alternatives to return, and whether to allow interim results.
  *
  * Once the speech recognition object is set up, it can be used to start and stop recognition, and to handle recognition events such as 
  * when speech is detected, when results are available, and when errors occur. The results of speech recognition can be obtained as a list 
  * of recognition alternatives, which contain the recognized text, confidence scores, and other information.
  */ 
  // Set up the SpeechRecognition object
  const recognition = new SpeechRecognition();
  // Configure the recognition object to run continuously and return only final results
  recognition.continuous = true;
  recognition.interimResults = false;
  // Set the language to English (US)
  recognition.lang = 'en-US';
  
  // Set up the wake word grammar
  const wakeWord = 'Lexi';
  if (SpeechGrammarList !== undefined) {
    const speechRecognitionList = new SpeechGrammarList();

    /*
    * JSGF stands for "Java Speech Grammar Format" and is a grammar format used to define rules for speech recognition engines.
    * JSGF allows the creation of grammars that define a set of phrases or words that the speech recognition engine should recognize.
    * The grammar defines a set of rules that specify how the phrases or words can be combined or modified to form valid sentences or phrases. 
    * JSGF is based on the Java programming language and is widely supported by many speech recognition engines.
    *
    * JSGF provides a flexible and powerful way to define grammars for speech recognition engines. By creating well-designed JSGF grammars, 
    * developers can greatly improve the accuracy and reliability of speech recognition systems, and provide more intuitive and natural user 
    * interfaces for their applications.
    */ 
    // Define the wake word grammar using JSGF format
    const g_wakeWord = `#JSGF V1.0; grammar wakeWord; public <wake> = ${wakeWord};;`
    speechRecognitionList.addFromString(g_wakeWord, 1);
  
    // Add the wake word grammar to the recognition object's grammars list
    recognition.grammars = speechRecognitionList;
    
    // Start listening for the wake word
    recognition.start();
    // Log a message to the console indicating that the wake word is being listened for
    console.log(`Listening for wake word "${wakeWord}"`);
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