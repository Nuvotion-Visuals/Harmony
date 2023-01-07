const express = require('express');
const bodyParser = require('body-parser');
const { TextToSpeechClient, TextToSpeech } = require('@google-cloud/text-to-speech');

const client = new TextToSpeechClient({
  keyFilename: './key.json',
});

async function synthesizeText(text, res) {
  const request =  {
    input: { text: text },
    voice: {
      languageCode: 'en-US',
      voiceType: 'Neural2',
      name: 'en-US-Neural2-C',
      ssmlGender: 'FEMALE'
    },
    audioConfig: {
      audioEncoding:'LINEAR16' 
    }
  };
  const [response] = await client.synthesizeSpeech(request);
  res.setHeader('Content-Type', 'audio/wav');
  res.send(response.audioContent);
}

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/tts', async (req, res) => {
  const text = req.query.text;
  try {
    await synthesizeText(text, res);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/', async (req, res) => {
  const text = `With LexiTTS, you can synthesize realistic speech using Google Cloud's neural text-to-speech capabilities.`
  const audioUrl = `http://localhost:1621/tts?text=${encodeURIComponent(text)}`;
  res.send(`
    <head><title>LexiTTS</title></head>
    <center>
      <div style='font-family: sans-serif; text-align: justify; line-height: 1.5; width: 700px; max-width: calc(100% - 2rem);'>
        <h2>LexiTTS</h2>
        <p>Synthesize realistic speech using Google Cloud's neural text-to-speech capabilities.</p>
        <h3>Speech</h3>
        <audio controls autoplay style='width: 100%;'>
          <source src="${audioUrl}" type="audio/wav">
        </audio>
        <h3>Text</h3>
        <p >
          ${text}
        </p>
        <br />
        <br />
        <h3>New Text-to-Speech</h3>
        <form action='http://localhost:1621/tts/ui'>
          <textarea name='text' style='width: 100%; min-height: 200px; padding: .75rem;'></textarea>
          <br />
          <br />
          <button style='padding: .75rem;'>
            Speak
          </button>
        </form>
      </div>

     
    </center>
  `);
});

app.get('/tts/ui', async (req, res) => {
  const text = req.query.text;
  const audioUrl = `http://localhost:1621/tts?text=${encodeURIComponent(text)}`;
  res.send(`
    <head><title>LexiTTS</title></head>
    <center>
      <div style='font-family: sans-serif; text-align: justify; line-height: 1.5; width: 700px; max-width: calc(100% - 2rem);'>
        <h2>LexiTTS</h2>
        <p>Synthesize realistic speech using Google Cloud's neural text-to-speech capabilities.</p>
        <h3>Speech</h3>
        <audio controls autoplay style='width: 100%;'>
          <source src="${audioUrl}" type="audio/wav">
        </audio>
        <h3>Text</h3>
        <p >
          ${text}
        </p>
        <br />
        <br />
        <h3>New Text-to-Speech</h3>
        <form action='http://localhost:1621/tts/ui'>
          <textarea name='text' style='width: 100%; min-height: 200px; padding: .75rem;'></textarea>
          <br />
          <br />
          <button style='padding: .75rem;'>
            Speak
          </button>
        </form>
      </div>

     
    </center>
  `);
});

app.listen(1621, () => {
  console.log('Text-to-speech server listening on port 1621');
});