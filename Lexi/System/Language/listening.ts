

export function listenForWakeWord(callback: () => void) {
    // @ts-ignore
    const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList 

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition

    // Check if SpeechRecognition is available
    if (!('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported by your browser');
      return;
    }
  
    // Set up the SpeechRecognition object
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    // Set up the wake word grammar
    const wakeWord = 'Lexi';
    if (SpeechGrammarList !== undefined) {
      const speechRecognitionList = new SpeechGrammarList();

      const g_wakeWord = `#JSGF V1.0; grammar wakeWord; public <wake> = ${wakeWord};;`
      speechRecognitionList.addFromString(g_wakeWord, 1);
  
      recognition.grammars = speechRecognitionList;
    
      // Start listening for the wake word
      recognition.start();
      console.log(`Listening for wake word "${wakeWord}"`);
    
      // Set up the event handler for when the wake word is recognized
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        if (result === wakeWord) {
          callback();
        }
      }
    }
  }