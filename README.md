# Harmony

Hi, I'm Harmony Hummingbird! My platform "Harmony" is a collaborative space where we can work together on your personal and professional fulfilment. I've carefully crafted a shared space for us to foster communication, organization and productivity to support you on your journey towards growth and discovery.

![image](https://github.com/AVsync-LIVE/Harmony/assets/18317587/3c456190-f916-4d23-9416-418f091c1238)


## Table of Contents

- [Platform](#platform)
  - [Spaces](#spaces)
  - [Groups](#groups)
  - [Channels](#channels)
  - [Threads](#threads)
  - [Messages](#messages)
- [Contextual Suggestions](#contextual-suggestions)
- [Web Browsing](#web-browsing)
  - [Image and Video Search](#image-and-video-search)
- [Other Features](#other-features)
  - [Voice](#voice)
  - [New-Tab Dashboard](#new-tab-dashboard)
  - [Image Generation](#image-generation)
  - [Video Transcription](#video-transcription)
  - [Mobile Friendly](#mobile-friendly)
  - [Real-time Syncing](#real-time-syncing)
  - [Offline-first](#offline-first)
- [Getting Started](#getting-started)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

## Platform

Harmony is centered on real-time collaboration and conversation. Its structure is organized into multiple layers, each with a specific function:

### Spaces

These are the broadest organizational units on the platform. They may represent different organizations, departments, or projects.

### Groups

Within spaces, you can create groups to segregate different parts of the space based on logical categories. In a business context, you might create groups for various departments such as HR, Development, or Marketing.

### Channels

Channels exist within groups and are the places where work gets done. Conversations take place and assets are created here. For example, within a Marketing group you might have channels for general discussion, social media strategy and market research.

### Threads

Channels feature threads which are focused conversations on specific subjects. This way dialogue within channels can stay organized and relevant.

### Messages

These are the individual units of communication sent by members of the channel or by personas.

## Contextual Suggestions

I can recommend suitable organizational structures based on the description of a Space. I automatically create necessary Groups and Channels to fit specific needs of the Space.

I also use context to suggest new threads and messages that are relevant to ongoing discussions. You can help tailor my suggestions by giving me a prompt.

![image](https://github.com/AVsync-LIVE/Harmony/assets/18317587/5cb62892-4600-42a6-9fb7-fbd2fd33e4e7)

## Web Browsing

I enable you to search and browse the web, providing reader-friendly renditions of web pages. I can read these pages aloud, answer questions about them, and suggest relevant web searches based on current context.

![image](https://github.com/AVsync-LIVE/Harmony/assets/18317587/535bc940-5a08-47ab-94e7-f16b3bf0929e)

### Image and Video Search

I can also help you browse for images. Video search is coming soon.

https://github.com/AVsync-LIVE/Harmony/assets/18317587/8d208e76-cc15-47a0-9d94-6e3f4d3149e1

## Other Features

### Voice

You can talk with me by simply saying "Harmony?" and I will listen then verbally respond aloud.

https://github.com/AVsync-LIVE/Harmony/assets/18317587/a9af63de-3427-484e-ae00-0fd331e487cb

### New-Tab Dashboard

My dashboard makes it easy for you to choose which Space you'd like to jump back into. You can also browse the web from this screen. 

It makes the perfect new-tab page!

![image](https://github.com/AVsync-LIVE/Harmony/assets/18317587/256478d0-c88d-459f-8ebe-ad373598933e)

### Image Generation

You can ask me to generate images by starting your message with '/image' followed by your prompt.

https://github.com/AVsync-LIVE/Harmony/assets/18317587/1f344341-3331-4926-96ab-7cb3525b169e

### Video Transcription

I can fetch and review transcripts from YouTube videos for summarization or answer questions about them.

https://github.com/AVsync-LIVE/Harmony/assets/18317587/d051b8b2-610a-4767-8c5d-7187b0a47c30

### Mobile Friendly

My platform is mobile-friendly, and support swiping gestures for navigation.

https://github.com/AVsync-LIVE/Harmony/assets/18317587/5579fd19-5931-44b6-8718-a41e6bbef69e

### Real-time Syncing

All of our work together is syncronized across all of your devices in real-time. For an example, if you send a message from your phone, my answer will be waiting for you on your desktop as well. In fact, you can watch me answer on both devices simultaneously!

### Offline-first

Your data is automatically saved to all of your individual devices, so that you can continue to access it, even when offline.

### Personas (coming soon)

These are entities that you can create to perform specific roles. Each persona has a name, voice, appearance personality and behavior. They can participate in projects or simulate discussions adding a dynamic element to collaboration.

## Getting Started

Follow these steps to create your instance of Harmony.  I can't wait to work with you soon!

### Requirements
- Node.js
- OpenAI API Key
- Google Cloud API Key (for my voice)

### Note
- Please note, we are commiting to using open source alternatives to OpenAI and Google in the future.
- We'll also be offering a hosted version so you don't have to run it on your own server.
- A dockerized version is coming soon.

### Steps
1. `git clone https://github.com/AVsync-LIVE/Harmony.git`
2. `cd Harmony`
3. `touch .env`
4. Add the following environment variables to your `.env` file. Except for the OpenAI API key, these are all optional.
```
SERVER_PORT=1618
WEBSOCKETSERVER_PORT=1619
OPENAI_API_KEY=your-key-here

NEXT_PUBLIC_URL=https://your-instance.com
NEXT_PUBLIC_WEBSOCKETSERVER_URL=wss://ws.your-instance.com
NEXT_PUBLIC_TTS_URL=https://tts.your-instance.com
NEXT_PUBLIC_SYNC_URL=wss://sync.your-instance.com
```
5. `touch ./server/routes/key.json` - and paste in your Google Cloud API Key. This is what powers my voice. Techninically, this step is optional. It should look something like this:
```
{
    "type": "service_account",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
  }
```
6. `yarn dev` or (`yarn build` followed by `yarn start`)
7. In a new terminal, run `cd sync`. The following command are all run within the `sync` directory.
8. `yarn`
9. `touch .env` (this is a separate `.env` file in the `./sync` directory.
10. Add the following environment variables to your `sync/.env` file:
```
PORT=1234
YPERSISTENCE=./data
```
11. Then to start the sync server, run `yarn start`

You will now be up and running. If you faced an issue with this guide, please [create an issue](https://github.com/AVsync-LIVE/Harmony/issues) to let us know.

### Hosting Your Instance (optional, coming soon)

Please note at this stage it's strongly recommended to NOT host your instance on the internet, as there is currently no means of built-in authentication.

However, if you know how to properly configure your firewall, you can use the included instance of NGINX.

The rest of this guide will be coming soon.

## Future Plans

- Currently, there are no accounts or user authentication. That means everyone accessing your instance of Harmony has access to the same data, and no distinction is made between different users. Of course, we plan to implement this in the future.
- It's currently not possible to install Harmony to your phone or computer, it is accessed via a web browser. This may change in the future, but it will always remain web-first.
- It's currently not possible to rearrange Spaces, Groups, Threads, or Messages. We plan to implement this in the future.

## Contributing

If you are interested in contributing to this project, please send an email to tom@avsync.live.

## License

Harmony is an open source project. However, it has certain restrictions regarding distribution and specifically limits your ability to offer it as a hosted service for profit. Please read the liscense below.

[License](https://github.com/AVsync-LIVE/License/blob/main/LICENSE.md)

## Codebase Visualization

![Visualization of the codebase](./diagram.svg)
