# LexiTTS
LexiTTS is a text-to-speech (TTS) project that allows you to convert written text into spoken words using Google's Text-to-Speech API.

## Getting Started
To use LexiTTS, you will need to create a service account key and download the JSON file from the Google Cloud Console. Follow these steps to do this:

1. Go to https://console.cloud.google.com/apis/credentials
2. Click the blue "create credentials" button on the top left and select "service account key." If the button is not there, you may need to first create a service account.
3. Choose the service account you want to use and select "JSON" as the key type.
4. Google will generate and download a JSON file for you to use.
5. Next, install the required dependencies by running:

`npm install`

Then, start the server using:

`node index.js`

## Using Docker
You can also use Docker to start the LexiTTS container. First, ensure that you have Docker and Docker Compose installed on your system. Then, in the root directory of the project, create a file named .env and add the following line to it, replacing /path/to/key.json with the path to your service account key file:

`GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`

Next, run the following command to build and start the container using Docker Compose:

`docker-compose up -d`

This will start the LexiTTS container and expose the endpoints on port 1621.

## Endpoints
LexiTTS includes two endpoints:

### /tts
This endpoint converts text to speech. It takes a text query parameter in the request and returns a WAV audio file containing the spoken words.

### /api/tts
This endpoint returns a webpage with a player that plays the spoken words. It takes a text query parameter in the request and returns a webpage with an audio player that plays the spoken words.

## Usage
You can make requests to the endpoints using a tool like Postman or by using a web browser. For example, to make a request to the /tts endpoint, you can use the following URL:

`http://localhost:1621/tts?text=Hello%20world!`

This will return a WAV audio file containing the spoken words "Hello world!".

## Questions or Issues
If you have any questions or encounter any issues while using LexiTTS, please don't hesitate to reach out. We're here to help!