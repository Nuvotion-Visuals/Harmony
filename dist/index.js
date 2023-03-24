"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// @ts-ignore
var next = require('next');
var fs = require('fs');
var express = require('express');
var join = require('path').join;
var fetchTranscript = require('youtube-transcript').default.fetchTranscript;
var uuidv4 = require('uuid').v4;
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var extract = require('@extractus/article-extractor').extract;
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
var numberWithCommas = function (x) {
    return (typeof x === 'string' ? x : x.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
var errorMessagesLanguageModelServer = {
    400: {
        meaning: 'Bad Request',
        message: 'This status code indicates that the language model server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
        recommendation: 'If you are seeing a 400 status code, it may indicate that there is a problem with the format or content of the request. Check the syntax and structure of the request to make sure it is correct and try again. If the problem persists, it may be necessary to contact the language model server administrator or the client application developer for further assistance.'
    },
    401: {
        meaning: 'Unauthorized',
        message: 'This status code indicates that the request requires HTTP authentication. The request should be accompanied by an Authorization header field containing a credential suitable for accessing the requested resource.',
        recommendation: 'If you are seeing a 401 status code, it may indicate that you are trying to access a resource that requires authentication. Check that you have provided the correct credentials in the request and try again. If the problem persists, it may be necessary to contact the language model server administrator or the client application developer for further assistance.'
    },
    403: {
        meaning: 'Forbidden',
        message: 'This status code indicates that the language model server understood the request but refuses to authorize it. A 403 response is not a guarantee that the client will not be able to access the resource at some point in the future. When the language model server returns a 403 response, it generally means that the client must authenticate itself to get the requested response.',
        recommendation: 'If you are seeing a 403 status code, it may indicate that you do not have permission to access the requested resource. Check that you have the correct permissions and try again. If the problem persists, it may be necessary to contact the language model server administrator or the client application developer for further assistance.'
    },
    404: {
        meaning: 'Not Found',
        message: 'This status code indicates that the language model server cannot find the requested resource. This may be because the resource does not exist or because the language model server is unable to access the resource.',
        recommendation: 'If you are seeing a 404 error, you may want to check that the URL you are trying to access is correct. If it is correct, the resource may have been moved or deleted. You may also want to check the language model server logs to see if there are any issues that may be causing the language model server to be unable to access the resource.'
    },
    408: {
        meaning: 'Request Timeout',
        message: 'This status code indicates that the language model server did not receive a complete request message within the time that it was prepared to wait. This may be because the request took too long to be sent or because the language model server was too busy to process the request.',
        recommendation: 'If you are seeing a 408 error, you may want to check the network connection and try the request again. If the error persists, it may be due to a problem with the language model server or network infrastructure. You may want to check the language model server logs for more information.'
    },
    413: {
        meaning: 'Request Entity Too Large',
        message: 'This status code indicates that the server is unable to process the request because the request payload is too large. This may be because the request contains too much data or because the server has a size limit for requests.',
        recommendation: 'If you are seeing a 413 error, you may want to try reducing the size of the request payload. This may involve reducing the number of data points or the size of any attached files. You may also want to check with the server administrator to see if there are any size limits for requests. The limit of ChatGPT, the language model I use, is about 4,000 characters.'
    },
    429: {
        meaning: 'Too Many Requests',
        message: 'This status code indicates that the user has sent too many requests in a given amount of time. This may be because the user is making too many requests or because the language model server is unable to handle the volume of requests being made.',
        recommendation: 'If you are seeing a 429 error, you may want to check that you are not making too many requests in a short period of time. You may also want to check the language model server logs to see if there are any issues that may be causing the language model server to be unable to handle the volume of requests being made.'
    },
    500: {
        meaning: 'Internal Server Error',
        message: 'This status code indicates that an unexpected condition was encountered by the language model server while processing the request. This could be due to a bug in the language model server software or a problem with the language model server hardware.',
        recommendation: 'This usually occurs when the language model is not able to process your text. Try again, try shortening it, or try rephrasing it.'
    },
    503: {
        meaning: 'Service Unavailable',
        message: 'This status code indicates that the language model server is currently unable to handle the request due to maintenance or capacity issues. the language model server may be offline or under heavy load.',
        recommendation: 'If you are seeing a 503 status code, it is likely that the language model server is temporarily unavailable. In this case, you should try accessing the website again later. If the problem persists, you may want to contact the language model server administrator or the website owner for further assistance.'
    },
    504: {
        meaning: 'Gateway Timeout',
        message: 'This status code indicates that the language model server, while acting as a gateway or proxy, did not receive a timely response from the upstream server. This could be due to a problem with the network or a problem with the upstream server.',
        recommendation: 'If you are seeing a 504 status code, it is likely that there is a problem with the network or the upstream server. In this case, you should try accessing the website again later. If the problem persists, you may want to contact the language model server administrator or the website owner for further assistance.'
    },
    511: {
        meaning: 'Network Authentication Required',
        message: 'This status code indicates that the client must authenticate itself to get the requested response. This is similar to 401 (Unauthorized), but indicates that the client must authenticate itself to get the requested response. The client may repeat the request with a suitable Authorization header field.',
        recommendation: 'If you are seeing a 511 status code, it means that you need to authenticate yourself in order to access the requested resource. In this case, you should provide the appropriate authentication credentials in the request header. If you are unsure of how to do this or if the problem persists, you may want to contact the language model server administrator or the website owner for further assistance.'
    }
};
require('dotenv').config();
var LEXISERVER_PORT = parseInt(process.env.LEXISERVER_PORT || '1618');
var LEXIWEBSOCKETSERVER_PORT = parseInt(process.env.LEXIWEBSOCKETSERVER_PORT || '1619');
var DEV = process.env.NODE_ENV !== 'production';
var app = next({ dev: DEV });
var handle = app.getRequestHandler();
var languageModel = {};
var ready = false;
var languageModels = {};
var messagesByGuid = {};
var clients = {};
var messageGuids = {};
var threadsByThreadId = {};
var sendMessage = function (_a) {
    var conversationId = _a.conversationId, parentMessageId = _a.parentMessageId, personaLabel = _a.personaLabel, systemMessage = _a.systemMessage, userLabel = _a.userLabel, message = _a.message, threadId = _a.threadId, onComplete = _a.onComplete, onProgress = _a.onProgress;
    return __awaiter(void 0, void 0, void 0, function () {
        var guid, storedClient, ChatGPTAPI, api, onCompleteWrapper, onProgressWrapper, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    guid = uuidv4();
                    messageGuids[guid] = true;
                    storedClient = clients["".concat(systemMessage, "-").concat(personaLabel, "-").concat(userLabel)];
                    if (!!storedClient) return [3 /*break*/, 2];
                    return [4 /*yield*/, import('chatgpt')];
                case 1:
                    ChatGPTAPI = (_b.sent()).ChatGPTAPI;
                    api = new ChatGPTAPI({
                        apiKey: process.env.OPENAI_API_KEY || '',
                    });
                    storedClient = {
                        api: api,
                        personaLabel: personaLabel,
                        systemMessage: systemMessage,
                        userLabel: userLabel,
                    };
                    clients["".concat(systemMessage, "-").concat(personaLabel, "-").concat(userLabel)] = storedClient;
                    _b.label = 2;
                case 2:
                    onCompleteWrapper = function (data) {
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
                    onProgressWrapper = function (partialResponse) {
                        if (onProgress) {
                            onProgress({
                                conversationId: conversationId,
                                parentMessageId: parentMessageId,
                                personaLabel: personaLabel,
                                systemMessage: systemMessage,
                                userLabel: userLabel,
                                message: message,
                                response: partialResponse.text,
                                progress: partialResponse.progress,
                            });
                        }
                    };
                    return [4 /*yield*/, storedClient.api.sendMessage("".concat(message), {
                            systemMessage: systemMessage,
                            parentMessageId: parentMessageId,
                            onProgress: onProgressWrapper,
                        })];
                case 3:
                    res = _b.sent();
                    onCompleteWrapper({
                        conversationId: conversationId,
                        parentMessageId: res.id,
                        personaLabel: personaLabel,
                        systemMessage: systemMessage,
                        userLabel: userLabel,
                        message: message,
                        response: res.text,
                    });
                    return [2 /*return*/, guid];
            }
        });
    });
};
// initalize websocket server
var WSS = require('ws').WebSocketServer;
var wss = new WSS({ port: LEXIWEBSOCKETSERVER_PORT });
var websock = {};
var serverStartTime = new Date().toLocaleTimeString([], { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
var initialized = false;
wss.on('connection', function connection(ws) {
    // receive message from client
    ws.onmessage = function (message) {
        var action = JSON.parse(message.data);
        // client sent ping
        if (action.type === 'ping') {
            ws.send(JSON.stringify({
                type: 'pong',
                message: {},
                time: new Date().toLocaleTimeString([], { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                guid: action.guid,
                status: 200,
                messageTime: action.messageTime
            }));
        }
        // client sent message
        if (action.type === 'message') {
            console.log(action);
            sendMessage({
                conversationId: action.conversationId,
                parentMessageId: action.parentMessageId,
                personaLabel: action.personaLabel,
                systemMessage: action.systemMessage,
                userLabel: action.userLabel,
                message: action.message,
                onComplete: function (_a) {
                    var response = _a.response, parentMessageId = _a.parentMessageId, conversationId = _a.conversationId;
                    console.log('Sending response to client');
                    ws.send(JSON.stringify({
                        // server send complete response to message
                        type: action.personaLabel === 'GENERATE' ? 'GENERATE_response' : 'response',
                        message: response || '',
                        guid: action.guid,
                        conversationId: conversationId,
                        parentMessageId: parentMessageId,
                        personaLabel: action.personaLabel,
                        systemMessage: action.systemMessage,
                        userLabel: action.userLabel,
                        status: 200,
                        messageTime: action.messageTime
                    }));
                },
                onProgress: function (_a) {
                    var response = _a.response, parentMessageId = _a.parentMessageId, conversationId = _a.conversationId;
                    ws.send(JSON.stringify({
                        // server send complete response to message
                        type: action.personaLabel === 'GENERATE' ? 'GENERATE_partial-response' : 'partial-response',
                        message: response || '',
                        guid: action.guid,
                        conversationId: conversationId,
                        parentMessageId: parentMessageId,
                        personaLabel: action.personaLabel,
                        systemMessage: action.systemMessage,
                        userLabel: action.userLabel,
                        status: 200,
                        messageTime: action.messageTime
                    }));
                },
            });
        }
    };
});
function readMarkdownFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.promises.readFile(filePath)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.toString()];
                case 2:
                    error_1 = _a.sent();
                    throw new Error("Failed to read markdown file at ".concat(filePath, ": ").concat(error_1.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
var https = require('https');
var stream = require('stream');
var httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Ignore SSL/TLS certificate errors
});
app.prepare().then(function () {
    var server = express();
    server.use(bodyParser.json({ limit: '10mb' }));
    server.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    server.use(express.static('public'));
    server.use(cookieParser());
    server.use(cookieSession({
        name: 'session',
        keys: ['eThElIMpLYMOSeAMaNKlEroashIrOw'],
        maxAge: 1.75 * 60 * 60 * 1000 // 1 hour 45 minutes 
    }));
    sendMessage({
        conversationId: '',
        parentMessageId: '',
        personaLabel: 'Lexi',
        systemMessage: 'Your name is Lexi.',
        userLabel: 'user',
        message: 'State if you are functioning properly. What is your name?',
        onComplete: function (_a) {
            var response = _a.response, parentMessageId = _a.parentMessageId, conversationId = _a.conversationId;
            console.log(response);
        },
        onProgress: function (_a) {
            var response = _a.response, parentMessageId = _a.parentMessageId, conversationId = _a.conversationId;
        },
    });
    // redirect if not logged in
    // server.use((req: any, res: any, next: any) => {
    //   if (
    //     req.originalUrl !== '/login' && 
    //     !req.session.loggedIn &&
    //     !req.originalUrl.startsWith('/_next') &&
    //     !req.originalUrl.startsWith('/assets') &&
    //     !req.originalUrl.startsWith('/auth')
    //   ) {
    //     res.redirect('/login')
    //     return
    //   }
    //   next()
    //   return
    // })
    server.get('/send-message', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, conversationId, parentMessageId, personaLabel, systemMessage, userLabel, message, threadId, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.query, conversationId = _a.conversationId, parentMessageId = _a.parentMessageId, personaLabel = _a.personaLabel, systemMessage = _a.systemMessage, userLabel = _a.userLabel, message = _a.message, threadId = _a.threadId;
                    console.log(res.query);
                    // Call the sendMessage function with the extracted data
                    return [4 /*yield*/, sendMessage({
                            conversationId: conversationId,
                            parentMessageId: parentMessageId,
                            personaLabel: personaLabel,
                            systemMessage: systemMessage,
                            userLabel: userLabel,
                            message: message,
                            threadId: threadId,
                            onComplete: function (data) {
                                res.status(200).json(__assign({}, data));
                            },
                        })];
                case 1:
                    // Call the sendMessage function with the extracted data
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    console.error(error_2);
                    res.status(500).send('An error occurred while sending the message');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    var fs = require('fs');
    var path = require('path');
    // Set cache duration to 1 hour
    var CACHE_DURATION = 24 * 60 * 60 * 1000;
    var cache = require('memory-cache');
    server.get('/image/prompt/:prompt', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var prompt, imageUrl, cachedImage, filename, imageBuffer, contentType, imageRes, contentType, imageBuffer, err_1, placeholderUrl, placeholderRes, contentType, placeholderBuffer, placeholderErr_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = req.params.prompt;
                    imageUrl = "https://image.pollinations.ai/prompt/".concat(encodeURIComponent(prompt));
                    cachedImage = cache.get(imageUrl);
                    if (cachedImage) {
                        res.setHeader('Content-Type', cachedImage.contentType);
                        res.send(cachedImage.data);
                        return [2 /*return*/];
                    }
                    filename = path.join(__dirname, 'data', 'images', "".concat(encodeURIComponent(prompt), ".jpg"));
                    if (fs.existsSync(filename)) {
                        imageBuffer = fs.readFileSync(filename);
                        contentType = 'image/jpeg';
                        res.setHeader('Content-Type', contentType);
                        res.send(imageBuffer);
                        // Store image in cache
                        console.log("Caching image ".concat(imageUrl));
                        cache.put(imageUrl, { contentType: contentType, data: imageBuffer }, CACHE_DURATION);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 10]);
                    return [4 /*yield*/, fetch(imageUrl, {
                            agent: httpsAgent,
                        })];
                case 2:
                    imageRes = _a.sent();
                    if (!imageRes.ok) {
                        throw new Error("Error fetching image from ".concat(imageUrl, ": ").concat(imageRes.status, " ").concat(imageRes.statusText));
                    }
                    contentType = imageRes.headers.get('content-type');
                    if (!contentType || !contentType.startsWith('image/')) {
                        throw new Error("Invalid content type for image: ".concat(contentType));
                    }
                    return [4 /*yield*/, imageRes.buffer()];
                case 3:
                    imageBuffer = _a.sent();
                    res.setHeader('Content-Type', contentType);
                    res.send(imageBuffer);
                    // Store image in cache and on disk
                    console.log("Caching image ".concat(imageUrl));
                    cache.put(imageUrl, { contentType: contentType, data: imageBuffer }, CACHE_DURATION);
                    fs.writeFileSync(filename, imageBuffer);
                    console.log("Saved image to disk: ".concat(filename));
                    return [3 /*break*/, 10];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error fetching image from ".concat(imageUrl, ": ").concat(err_1.message));
                    placeholderUrl = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, fetch(placeholderUrl, {
                            agent: httpsAgent,
                        })];
                case 6:
                    placeholderRes = _a.sent();
                    if (!placeholderRes.ok) {
                        throw new Error("Error fetching placeholder image from ".concat(placeholderUrl, ": ").concat(placeholderRes.status, " ").concat(placeholderRes.statusText));
                    }
                    contentType = placeholderRes.headers.get('content-type');
                    return [4 /*yield*/, placeholderRes.arrayBuffer()];
                case 7:
                    placeholderBuffer = _a.sent();
                    res.setHeader('Content-Type', contentType);
                    res.send(Buffer.from(placeholderBuffer));
                    return [2 /*return*/];
                case 8:
                    placeholderErr_1 = _a.sent();
                    console.error("Error fetching placeholder image from ".concat(placeholderUrl, ": ").concat(placeholderErr_1.message));
                    res.status(500).send("Error fetching image from ".concat(imageUrl));
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
    server.post('/tools/parse-article', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var contentUrl, input, error, status_1, message;
        return __generator(this, function (_a) {
            contentUrl = req.body.contentUrl;
            try {
                input = contentUrl;
                extract(input)
                    // @ts-ignore
                    .then(function (article) {
                    res.send({ status: 200, data: {
                            article: article
                        } });
                })
                    // @ts-ignore
                    .catch(function (e) {
                    var error = e;
                    console.log('🟣', "[I experienced the following error: ".concat(error));
                    var status = error.statusCode || error.code || 500;
                    var message = error.message || 'internal error';
                    res.send({ status: status, message: message });
                });
            }
            catch (e) {
                error = e;
                console.log('🟣', "[I experienced the following error: ".concat(error));
                status_1 = error.statusCode || error.code || 500;
                message = error.message || 'internal error';
                res.send({ status: status_1, message: message });
            }
            return [2 /*return*/];
        });
    }); });
    server.post('/tools/parse-youtube-video', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        function youtube_parser(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match && match[7].length == 11) ? match[7] : '';
        }
        var videoUrl, error, status_2, message;
        return __generator(this, function (_a) {
            videoUrl = req.body.videoUrl;
            try {
                getSubtitles({
                    videoID: youtube_parser(videoUrl),
                    lang: 'en'
                }).then(function (captions) {
                    var transcript = captions.map(function (cap) { return cap.text; }).join(' ');
                    res.send({ status: 200, data: {
                            transcript: transcript
                        } });
                });
            }
            catch (e) {
                error = e;
                console.log('🟣', "I experienced the following error: ".concat(error));
                status_2 = error.statusCode || error.code || 500;
                message = error.message || 'internal error';
                res.send({ status: status_2, message: message });
            }
            return [2 /*return*/];
        });
    }); });
    server.all('/next/*', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.status(400).json({ error: 'Next API route not found' });
            return [2 /*return*/];
        });
    }); });
    server.all('*', function (req, res) { return handle(req, res); });
    server.listen(LEXISERVER_PORT, function (err) {
        if (err)
            throw err;
        console.log('🟣', "I'm listening on port ".concat(LEXISERVER_PORT, "."));
    });
});
//# sourceMappingURL=index.js.map