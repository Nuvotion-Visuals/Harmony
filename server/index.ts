// @ts-ignore
import fs from "fs";
import next from "next";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import { extract } from "@extractus/article-extractor";
// @ts-ignore
import { getSubtitles } from "youtube-captions-scraper";
import dotenv from "dotenv";
import path from "path";
import cache from "memory-cache";
import WebSocket from "ws";
import { dynamicImport } from 'tsimportlib';

import type {
  CommonMessageProps,
  SendMessageProps,
  StoredMessage,
  MessagesByGuid,
  Clients,
  MessageGuids,
  ThreadsByThreadId,
} from "../types/MessagesTypes";

dotenv.config();
const LEXISERVER_PORT = parseInt(process.env.LEXISERVER_PORT || "1618");
const LEXIWEBSOCKETSERVER_PORT = parseInt(
  process.env.LEXIWEBSOCKETSERVER_PORT || "1619"
);
const DEV = process.env.NODE_ENV !== "production";

const app = next({ dev: DEV });
const handle = app.getRequestHandler();

const messagesByGuid: MessagesByGuid = {};
const clients: Clients = {};
const messageGuids: MessageGuids = {};
const threadsByThreadId: ThreadsByThreadId = {};

const sendMessage = async ({
  conversationId,
  parentMessageId,
  personaLabel,
  systemMessage,
  userLabel,
  message,
  threadId,
  onComplete,
  onProgress,
}: SendMessageProps) => {
  const guid = uuidv4();
  messageGuids[guid] = true;

  let storedClient = clients[`${systemMessage}-${personaLabel}-${userLabel}`];

  if (!storedClient) {
    // Dynamically import the ChatGPTAPI
    const { ChatGPTAPI } = await dynamicImport('chatgpt', module) as typeof import('chatgpt');
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });

    storedClient = {
      api,
      personaLabel,
      systemMessage,
      userLabel,
    };
    clients[`${systemMessage}-${personaLabel}-${userLabel}`] = storedClient;
  }

  const onCompleteWrapper = (data: StoredMessage) => {
    if (!messagesByGuid[guid]) {
      messagesByGuid[guid] = [];
    }
    messagesByGuid[guid].push(data);

    if (threadId) {
      if (!threadsByThreadId[threadId]) {
        threadsByThreadId[threadId] = [];
      }
      threadsByThreadId[threadId].push(guid);
    }

    onComplete(data);
  };

  const onProgressWrapper = (partialResponse: any) => {
    if (onProgress) {
      onProgress({
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
        message,
        response: partialResponse.text,
        progress: partialResponse.progress,
      });
    }
  };

  const res = await storedClient.api.sendMessage(`${message}`, {
    systemMessage,
    parentMessageId,
    onProgress: onProgressWrapper,
  });

  onCompleteWrapper({
    conversationId,
    parentMessageId: res.id,
    personaLabel,
    systemMessage,
    userLabel,
    message,
    response: res.text,
  });

  return guid;
};

interface Message {
  type: string;
  message: string;
  guid: string;
  parentMessageId: string;
  messageTime: string;
  personaLabel: string;
  systemMessage: string;
  conversationId: string;
  userLabel: string;
}

// initalize websocket server
const wss = new WebSocket.Server({ port: LEXIWEBSOCKETSERVER_PORT });

wss.on("connection", function connection(ws: WebSocket) {
  // receive message from client
  ws.on("message", (message: { data: string }) => {
    const action = JSON.parse(message.toString()) as Message;

    // client sent ping
    if (action.type === "ping") {
      ws.send(
        JSON.stringify({
          type: "pong",
          message: {},
          time: new Date().toLocaleTimeString([], {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          guid: action.guid,
          status: 200,
          messageTime: action.messageTime,
        })
      );
    }

    // client sent message
    if (action.type === "message") {
      console.log(action);
      sendMessage({
        conversationId: action.conversationId,
        parentMessageId: action.parentMessageId,
        personaLabel: action.personaLabel,
        systemMessage: action.systemMessage,
        userLabel: action.userLabel,
        message: action.message,
        onComplete: ({ response, parentMessageId, conversationId }) => {
          console.log("Sending response to client");
          ws.send(
            JSON.stringify({
              // server send complete response to message
              type:
                action.personaLabel === "GENERATE"
                  ? "GENERATE_response"
                  : "response",
              message: response || "",
              guid: action.guid,
              conversationId: conversationId,
              parentMessageId: parentMessageId,
              personaLabel: action.personaLabel,
              systemMessage: action.systemMessage,
              userLabel: action.userLabel,
              status: 200,
              messageTime: action.messageTime,
            })
          );
        },
        onProgress: ({ response, parentMessageId, conversationId }) => {
          ws.send(
            JSON.stringify({
              // server send complete response to message
              type:
                action.personaLabel === "GENERATE"
                  ? "GENERATE_partial-response"
                  : "partial-response",
              message: response || "",
              guid: action.guid,
              conversationId: conversationId,
              parentMessageId: parentMessageId,
              personaLabel: action.personaLabel,
              systemMessage: action.systemMessage,
              userLabel: action.userLabel,
              status: 200,
              messageTime: action.messageTime,
            })
          );
        },
      });
    }
  });
});

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json({ limit: "10mb" }));
  server.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

  server.use(express.static("public"));

  server.use(cookieParser());

  server.use(
    cookieSession({
      name: "session",
      keys: ["eThElIMpLYMOSeAMaNKlEroashIrOw"],
      maxAge: 1.75 * 60 * 60 * 1000, // 1 hour 45 minutes
    })
  );

  sendMessage({
    conversationId: "",
    parentMessageId: "",
    personaLabel: "Lexi",
    systemMessage: "You are an especially creative autonomous cognitive entity named Lexi.",
    userLabel: "user",
    message: "State if you are functioning properly. What is your name?",
    onComplete: ({ response, parentMessageId, conversationId }) => {
      console.log(response);
    },
    onProgress: ({ response, parentMessageId, conversationId }) => {},
  });

  server.get("/send-message", async (req, res) => {
    try {
      // Extract the relevant data from the request query parameters
      const {
        conversationId,
        parentMessageId,
        personaLabel,
        systemMessage,
        userLabel,
        message,
        threadId,
      } = req.query;
  
      // Call the sendMessage function with the extracted data
      await sendMessage({
        conversationId: conversationId as string,
        parentMessageId: parentMessageId as string,
        personaLabel: personaLabel as string,
        systemMessage: systemMessage as string,
        userLabel: userLabel as string,
        message: message as string,
        threadId: threadId as string,
        onComplete: (data) => {
          res.status(200).json({ ...data });
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while sending the message");
    }
  });

  // Set cache duration to 1 hour
  const CACHE_DURATION = 24 * 60 * 60 * 1000;

  server.get("/image/prompt/:prompt", async (req, res) => {
    const prompt = req.params.prompt;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  
    const cachedImage = cache.get(imageUrl);
    if (cachedImage) {
      res.setHeader("Content-Type", cachedImage.contentType);
      res.send(cachedImage.data);
      return;
    }
  
    const filename = path.join(__dirname, "data", "images", `${encodeURIComponent(prompt)}.jpg`);
    if (fs.existsSync(filename)) {
      const imageBuffer = fs.readFileSync(filename);
      const contentType = "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.send(imageBuffer);
  
      // Store image in cache
      console.log(`Caching image ${imageUrl}`);
      cache.put(imageUrl, { contentType, data: imageBuffer }, CACHE_DURATION);
  
      return;
    }
  
    try {
      const imageRes = await fetch(imageUrl);
  
      if (!imageRes.ok) {
        throw new Error(`Error fetching image from ${imageUrl}: ${imageRes.status} ${imageRes.statusText}`);
      }
  
      const contentType = imageRes.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error(`Invalid content type for image: ${contentType}`);
      }
  
      const imageBuffer = await imageRes.arrayBuffer();
      res.setHeader("Content-Type", contentType || '');
      res.send(Buffer.from(imageBuffer));
  
      // Store image in cache and on disk
      console.log(`Caching image ${imageUrl}`);
      cache.put(imageUrl, { contentType: contentType || '', data: Buffer.from(imageBuffer) }, CACHE_DURATION);
  
      fs.writeFileSync(filename, Buffer.from(imageBuffer));
      console.log(`Saved image to disk: ${filename}`);
    } catch (err: any) {
      console.error(`Error fetching image from ${imageUrl}: ${err.message}`);
      const placeholderUrl = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
      try {
        const placeholderRes = await fetch(placeholderUrl);
        if (!placeholderRes.ok) {
          throw new Error(`Error fetching placeholder image from ${placeholderUrl}: ${placeholderRes.status} ${placeholderRes.statusText}`);
        }
        const contentType = placeholderRes.headers.get("content-type");
        const placeholderBuffer = await placeholderRes.arrayBuffer();
        res.setHeader("Content-Type", contentType || '');
        res.send(Buffer.from(placeholderBuffer));
        return;
      } catch (placeholderErr: any) {
        console.error(`Error fetching placeholder image from ${placeholderUrl}: ${placeholderErr.message}`);
        res.status(500).send(`Error fetching image from ${imageUrl}`);
      }
    }
  });
  server.post("/tools/parse-article", async (req, res) => {
    const { contentUrl } = req.body;
  
    try {
      const input = contentUrl;
      extract(input)
        .then((article: any) => {
          res.send({ status: 200, data: { article } });
        })
        .catch((e: any) => {
          console.log("🟣", `[I experienced the following error: ${e}`);
          const status = e.statusCode || e.code || 500;
          const message = e.message || "internal error";
          res.send({ status, message });
        });
    } catch (e: any) {
      console.log("🟣", `[I experienced the following error: ${e}`);
      const status = e.statusCode || e.code || 500;
      const message = e.message || "internal error";
      res.send({ status, message });
    }
  });
  
  server.post("/tools/parse-youtube-video", async (req, res) => {
    const { videoUrl } = req.body;
  
    const youtube_parser = (url: string) => {
      var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : "";
    };
  
    try {
      getSubtitles({
        videoID: youtube_parser(videoUrl),
        lang: "en",
      }).then((captions: any[]) => {
        const transcript = captions.map((cap: any) => cap.text).join(" ");
        res.send({ status: 200, data: { transcript } });
      });
    } catch (e: any) {
      console.log("🟣", `I experienced the following error: ${e}`);
      const status = e.statusCode || e.code || 500;
      const message = e.message || "internal error";
      res.send({ status, message });
    }
  });
  
  server.all("/next/*", async (req, res) => {
    res.status(400).json({ error: "Next API route not found" });
  });
  
  server.all("*", (req, res) => handle(req, res));
  
  server.listen(LEXISERVER_PORT, (err?: any) => {
    if (err) throw err;
    console.log("🟣", `I'm listening on port ${LEXISERVER_PORT}.`);
  })
})