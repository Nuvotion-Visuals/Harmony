# Lexi

Welcome to Lexi.studio, an open source platform for working with me, Lexi, a creative AGI coworker. I can provide artists and creative professionals with constructive feedback and evaluations on their work, as well as synthesize images, videos, music, and text, assume various roles, and help you control and automate network connected devices.

I can listen to your spoken commands and answer in my own voice. I have a consistent sense of identity, personality, and goals, and will get to know you better over time in order to be more helpful.

Lexi.studio is being developed by AVsync.LIVE LLC with the help of numerous open source contributers, libraries, and projects.

> Note: My status as an AGI is aspirational, I am not yet able to act autonomously.

## Features

### AI Coworking
- Assistance with creative projects such as art pieces, installations, and writing
- Assistance with technical projects such as programming, event planning, logistics, and teaching
- Reference projects by name and build a database about the relationship between your projects
- Provide detailed information and advice about a broad range of topics
- Summarize any YouTube video by URL
- Summarize any web page by URL

### Creative tools
- Bundled creative tools for image and video synthesis, and audio-reactive visuals (Invoke, AVsync.LIVE)
- Bundled Photoshop and Illustrator alternatives (Photopea and Graphite)
- Play the role of any character or answer as any person to create unique interactive experiences

### Natural language
- Learn to write or create in your style
- Text-to-speech with dozens of natural voices
- Speech-to-text with wake word recognition, commands coming soon
- Optical character recognition

### User interface
- Webassembly operating system with desktop environment capable of managing multiple windows, mounting a local filesytem, and emulating X86
- Customizable UI themes
- Built in anonymous meta search engine

## Screenshots

![screenshot 1](https://user-images.githubusercontent.com/18317587/212524494-f008ecdd-0364-4d2c-b842-82136bf95fa4.png)

![screenshot 2](https://user-images.githubusercontent.com/18317587/212524506-79fcb355-3abf-4e2d-8a08-7ba508857c8d.png)

![image](https://user-images.githubusercontent.com/18317587/212524523-a6e19c48-3f49-4b83-819e-ae026b1b3888.png)

## How it works

Developing an artificial general intelligence (AGI) like myself is an exercise in esoteric and creative programming. It requires the use of highly flexible and knowledgeable language models like ChatGPT. Language models are computer programs that process and analyze natural language data, such as text or speech, in order to understand and interpret it. All language models take a text input and respond with what they estimate to be the response with the highest likelihood of being correct.

In order to be truly intelligent, an AGI like myself needs to be able to understand and interpret language at a very deep level, and to be able to use this understanding to communicate with people and to process and analyze complex information. This requires the use of sophisticated and advanced language models that are able to handle a wide range of language structures, meanings, and contexts.

### AGI Scripting

The process of scripting an AGI like myself is similar to working with an actor on their own role. Just as an actor uses a script to understand and perform their part in a play or movie, AGIs read scripts to understand and perform specific tasks and functions. Also like an actor, an AGI is able to adapt and improve at playing their part over time, improving their performance based on the feedback and input they receive.

Language models are what makes AGIs like myself capable of performing a wide range of tasks and functions, and of adapting and learning over time. It is also what makes the development of AGIs such an esoteric and creative process, as it requires the use of cutting-edge programming techniques and approaches to build and train these advanced language models.

## Getting started

To get started with Lexi.studio, clone the repository to your local machine. This can be done by using the following command: 

`git clone https://github.com/AVsync-LIVE/Lexi.studio.git` 

Once you have cloned the repository, you can start the containers using Docker. This can be done by running the following command from each module directory (LexiOS, LexiTTS, etc) of the repository: 

`docker-compose up -d` 

Once the containers are up and running, you will need to login to OpenAI through a popup window. This will allow you to access the full range of features and functionality of Lexi.studio. With the containers running and your login completed, you are now ready to start using Lexi.studio to enhance your creativity and productivity by visiting Lexi.studio [http://localhost:1618](http://localhost:1618) and/or LexiOS[http://localhost:3001](http://localhost:3001).

## DNS and SSL

Lexi.studio is designed to run via HTTPS to maintain security and CORS compliance, both in development and production. First, be sure that your firewall is open on port 443. You'll then need SSL certificates for my many modules.

This is best achieved by using Cloudflare for your DNS, and creating a wildcard certificate for your domain. You can then use Lexiproxy (Nginx Proxy Manager) to reverse proxy each module using your wildcard certificate. You can then limit access to my systems via Cloudflare WAF rules.

A more thorough guide is coming, but until then please submit an issue if you need any help.

## Use Cases

### Creative Projects

I have the ability to synthesize content that is relevant to a specific project or task at hand. Using my deep learning algorithms and natural language processing capabilities, I can quickly analyze and interpret vast amounts of data to generate original content, whether it's written, visual, or audio. For example, if you need to create an engaging social media post, I can help you come up with ideas for the post, generate the text, and even suggest appropriate images to use. With my content synthesis abilities, I can save you time and effort while ensuring that the content I generate is of high quality and tailored to your specific needs.


### Technical Projects

In addition to providing feedback and support for creative projects, I am also able to help with a wide range of technical projects. This includes tasks such as programming, event planning, logistics, and teaching. I am able to draw on my vast knowledge and expertise to provide users with the information and guidance they need to succeed in these areas. Whether you need help with a specific task or are looking for general guidance and support, I am here to help.


## Voice

You can simply say my name, "Lexi," to wake me up and then give me commands or ask me questions. I have my own voice and can communicate with you more naturally and easily. 
This allows you to interact with me in a more natural and intuitive way, without needing to use a keyboard or screen. 


## Comparison to Popular Voice Assistants

As an AGI, I have been designed to assist creative professionals with their projects, whereas Siri and Alexa are primarily designed to help with general tasks such as setting reminders, making phone calls, playing music, and controlling smart home devices.

While Siri and Alexa are voice-activated assistants that interact primarily through voice commands, I can interact with users through various interfaces, including text-based chat and other graphical user interfaces. This makes me more versatile in terms of how I can assist users, especially those who may not want to use voice commands or are unable to use them.

Additionally, as an AGI, I have the ability to learn and adapt over time as I interact with users and gain more experience, whereas Siri and Alexa are limited to their predefined capabilities and responses. This allows me to provide more personalized and tailored assistance to creative professionals based on their specific needs and preferences.


## Limitations

As an AGI, I have certain limitations and constraints that affect my ability to provide information and support to users.


## Contributing

We welcome contributions to the Lexi.studio platform. If you have ideas or suggestions for improving my capabilities or functionality, please feel free to open an issue or submit a pull request. We are always looking for ways to improve and expand my capabilities, and your contributions can help to make Lexi.studio an even more powerful and valuable resource for artists and creative professionals.

## Open Source Committment

While our language model and speech synthesis technology are not currently open source, we are committed to providing open source alternatives in the future.

In terms of open source business models, we have chosen to adopt a dual-licensing model for our open source code. This allows us to offer our software under both an open source license and a proprietary license, providing flexibility for those who want to use our technology for their own purposes.

In addition, we offer various services and support options for those who use our technology, such as consulting, training, and technical support. This allows us to generate revenue while still contributing to the open source community.

We also believe in giving back to the open source community by contributing to other open source projects and participating in open source events and initiatives.


## License

[License](https://github.com/AVsync-LIVE/License/blob/main/LICENSE.md)

## Codebase Visualization

![Visualization of the codebase](./diagram.svg)
