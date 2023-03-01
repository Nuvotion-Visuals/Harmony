"use strict";
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
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var extract = require('@extractus/article-extractor').extract;
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var getTimeDifference = function (startTime, endTime) {
    return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
};
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
var currentConversationId = 'NO_CURRENT_CONVERSATION_ID';
var currentMessageId = 'NO_CURRENT_MESSAGE_ID';
// send message to language model
var sendMessageToLanguageModel = function (message, onComplete, onProgress) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, response, messageId, error_1, errorCodeRegex, errorCode;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, languageModel.sendMessage("".concat(message, "\n(You are a creative AGI named Lexi developed by AVsync.LIVE who assists creative professionals with their projects)"), {
                            conversationId: currentConversationId,
                            parentMessageId: currentMessageId,
                            timeoutMs: 2 * 60 * 1000,
                            onProgress: function (partialResponse) {
                                onProgress({ status: 200, data: { response: partialResponse.response } });
                                currentMessageId = partialResponse.messageId;
                            }
                        })];
                case 1:
                    _a = _f.sent(), response = _a.response, messageId = _a.messageId;
                    currentMessageId = messageId;
                    onComplete({ status: 200, data: { response: response } });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _f.sent();
                    if (error_1 instanceof Error) {
                        console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] I experienced the following error: ").concat(error_1));
                        errorCodeRegex = /error (\d+)/;
                        errorCode = Number((_b = (error_1.message || 'error 500').match(errorCodeRegex)) === null || _b === void 0 ? void 0 : _b[1]);
                        onComplete({
                            status: 500,
                            data: {
                                response: "I experienced the following error when trying to access my language model.<br />".concat(((_c = errorMessagesLanguageModelServer === null || errorMessagesLanguageModelServer === void 0 ? void 0 : errorMessagesLanguageModelServer[errorCode]) === null || _c === void 0 ? void 0 : _c.meaning) ? "<p>".concat((_d = errorMessagesLanguageModelServer === null || errorMessagesLanguageModelServer === void 0 ? void 0 : errorMessagesLanguageModelServer[errorCode]) === null || _d === void 0 ? void 0 : _d.meaning, "</p><p>").concat((_e = errorMessagesLanguageModelServer === null || errorMessagesLanguageModelServer === void 0 ? void 0 : errorMessagesLanguageModelServer[errorCode]) === null || _e === void 0 ? void 0 : _e.recommendation, "</p>") : '', "<br><pre>").concat(error_1.message, "</pre><pre>").concat(error_1.stack, "</pre>")
                            }
                        });
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
};
// initalize websocket server
var WSS = require('ws').WebSocketServer;
var wss = new WSS({ port: LEXIWEBSOCKETSERVER_PORT });
var websock = {};
var serverStartTime = new Date().toLocaleTimeString([], { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
var initialized = false;
wss.on('connection', function connection(ws) {
    console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] My web socket server is ready for connections"));
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
            sendMessageToLanguageModel(action.message, function (_a) {
                var data = _a.data, status = _a.status;
                ws.send(JSON.stringify({
                    // server send complete response to message
                    type: 'response',
                    message: data.response || '',
                    guid: action.guid,
                    status: status,
                    messageTime: action.messageTime
                }));
            }, function (_a) {
                var data = _a.data, status = _a.status;
                console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] Sending my partial response to the user: ").concat(data.response));
                ws.send(JSON.stringify({
                    // server sent partial response to message
                    type: 'partial-response',
                    message: data.response || '',
                    guid: action.guid,
                    status: status,
                    messageTime: action.messageTime
                }));
            });
        }
        // if (action.type === 'initialize') {
        //   (async () => {
        //     if (!initialized) {
        //       initialized = true
        //       const scriptInitializationTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        //       const getDirectories = (source: string) =>
        //         fs.readdirSync(source, { withFileTypes: true })
        //           .filter((dirent: any) => dirent.isDirectory())
        //           .map((dirent : any) => dirent.name)
        //       const scriptNames = sortByNumber(getDirectories('./Lexi/Scripts/'))
        //       const scriptPaths = scriptNames.map(scriptName => `./Lexi/Scripts/${scriptName}/Readme.md`)
        //       let pageCount = 0
        //       let wordCount = 0
        //       let characterCount = 0
        //       let numberOfSteps = 0
        //       let step = 1
        //       ws.send(JSON.stringify({
        //         type: 'initialize-response',
        //         message: null,
        //         response: `Hi there. I'm about to begin reading my artificial general intelligence (AGI) scripts. I have ${scriptNames.length} to read. The time this will take will largely depend on the current responsiveness of the language model. I'll update you with my progress as I read them.`,
        //         guid: 'Initialize',
        //         status: 200,
        //         scriptName: 'Introduction'
        //       }))
        //       const logResults = async (scripts: string[]) => {
        //         numberOfSteps = scripts.length
        //         for (const script of scripts) {
        //           const result = await readMarkdownFile(script)
        //           const scriptName = extractScriptNameFromPath(script)
        //           const scriptWordCount = countWords(result)
        //           const scriptCharacterCount = result.length
        //           const scriptPageCount = scriptWordCount / 250
        //           const messageTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        //           // keep trying if it fails
        //           let keepTrying
        //           let failCount = 0
        //           let messageId = ''
        //           let response = 'I failed to connect'
        //           console.log(`Making async function call: ${scriptName}`);
        //             try {
        //               const data = await languageModel.sendMessage(result, {
        //                 conversationId: currentConversationId,
        //                 parentMessageId: currentMessageId,
        //                 timeoutMs: 2 * 60 * 1000
        //               })
        //               messageId = data.messageId
        //               response = data.response
        //               currentMessageId = messageId
        //               const responseTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        //               wordCount += scriptWordCount
        //               characterCount += scriptCharacterCount
        //               pageCount += scriptPageCount
        //               const fullResponse = `${response} That was ${step} of ${numberOfSteps} scripts I'm currently in the process of reading. It was ${numberWithCommas(scriptCharacterCount)} characters, which is ${numberWithCommas(scriptWordCount)} words or ${numberWithCommas(scriptPageCount.toFixed(1))} pages, and would take a human ${numberWithCommas((scriptWordCount / 300).toFixed(1))} minutes to read. It took me ${(getTimeDifference(messageTime, responseTime) / 60).toFixed(0) === '0' ? `${(getTimeDifference(messageTime, responseTime))} seconds` : `${(getTimeDifference(messageTime, responseTime) /60).toFixed(1)} minutes`}. I have been reading scripts for ${(getTimeDifference(scriptInitializationTime, responseTime) / 60).toFixed(1)} minutes and have read ${numberWithCommas(pageCount.toFixed(1))} pages.`
        //               step += 1
        //               console.log('🟣', fullResponse)
        //               ws.send(JSON.stringify({
        //                 type: 'message',
        //                 message: `Read your ${scriptName}`,
        //                 response: fullResponse,
        //                 guid: `${scriptName}`,
        //                 status: 200,
        //                 messageTime,
        //                 responseTime,
        //                 scriptName,
        //               }))
        //             } catch (error) {
        //               console.error(error);
        //               // add failure message
        //             }
        //           }
        //       }     
        //       const startTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        //       await logResults(scriptPaths)
        //       const endTime = new Date().toLocaleTimeString([], {weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})
        //       await new Promise(resolve => setTimeout(resolve, 5000));
        //       // add failure message
        //       const response = 
        //         wordCount === 0
        //           ? `I wasn't able to read any of my scripts. I likely lost my connection to the language model. I suggest that you log out and log in again.`
        //           : `I read ${step - 1} scripts, totalling ${characterCount} characters, ${wordCount} words or ${pageCount} pages. It would take a human aproximately ${(wordCount / 300).toFixed(0)} minutes to read that many words. It took me ${(getTimeDifference(startTime, endTime) / 60).toFixed(0)} minutes.`
        //       console.log('🟣', response)
        //       ws.send(JSON.stringify({
        //         type: 'message',
        //         message: null,
        //         response: response,
        //         guid: `${Math.random()})`,
        //         status: 200,
        //         messageTime: startTime,
        //         responseTime: endTime
        //       }))
        //     }
        //     else {
        //       ws.send(JSON.stringify({
        //         type: 'message',
        //         message: null,
        //         response: `I have already read my scripts.`,
        //         guid: 'Already Initialize',
        //         status: 200
        //       }))
        //     }
        //   })()
        // }
    };
});
function readMarkdownFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.promises.readFile(filePath)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.toString()];
                case 2:
                    error_2 = _a.sent();
                    throw new Error("Failed to read markdown file at ".concat(filePath, ": ").concat(error_2.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sortByNumber(strings) {
    function extractNumber(string) {
        // Use a regular expression to extract the numeric portion of the string
        var matchResult = match(string, /\d+/);
        if (!matchResult) {
            throw new Error("Unable to extract number from string: ".concat(string));
        }
        // Return the extracted number as an integer
        return parseInt(matchResult[0], 10);
    }
    // Sort the strings using the extractNumber key function
    return sorted(strings, function (a, b) { return extractNumber(a) - extractNumber(b); });
}
function sorted(array, compareFn) {
    // Create a copy of the array
    var copy = array.slice();
    // Sort the copy using the compare function if provided, or the default comparison function if not
    copy.sort(compareFn || (function (a, b) { return a < b ? -1 : 1; }));
    // Return the sorted copy
    return copy;
}
var match = function (string, regex) {
    // Use the regex.exec() method to search for a match in the string
    var result = regex.exec(string);
    // If a match was found, return the match array
    if (result) {
        return result;
    }
    // If no match was found, return null
    return null;
};
var extractScriptNameFromPath = function (input) {
    return input.split(' ')[1].split('/')[0];
};
var countWords = function (s) {
    s = s.replace(/(^\s)|(\s$)/gi, ""); // exclude start and end white-space
    s = s.replace(/[ ]{2,}/gi, " "); // 2 or more spaces to 1
    s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
    return s.split(' ').filter(function (str) { return str !== ""; }).length;
};
// create app
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
    // login
    server.post('/auth/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password;
        return __generator(this, function (_b) {
            _a = req.body, email = _a.email, password = _a.password;
            try {
                (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ChatGPTAPIBrowser, identityScript, _a, response, conversationId, messageId, e_1, error, status_1, message;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 5, , 6]);
                                return [4 /*yield*/, import('chatgpt')];
                            case 1:
                                ChatGPTAPIBrowser = (_b.sent()).ChatGPTAPIBrowser;
                                languageModel = new ChatGPTAPIBrowser({
                                    email: email,
                                    password: password
                                });
                                return [4 /*yield*/, languageModel.initSession()];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, readMarkdownFile('./Lexi/Scripts/1. Identity/Readme.md')];
                            case 3:
                                identityScript = _b.sent();
                                return [4 /*yield*/, languageModel.sendMessage(identityScript, {
                                        onProgress: function (partialResponse) {
                                            currentMessageId = partialResponse.messageId;
                                        }
                                    })];
                            case 4:
                                _a = _b.sent(), response = _a.response, conversationId = _a.conversationId, messageId = _a.messageId;
                                console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] Sending my reponse to the user: ").concat(response));
                                currentConversationId = conversationId;
                                currentMessageId = messageId;
                                req.session.loggedIn = true;
                                ready = true;
                                res.send({ status: 200 });
                                return [3 /*break*/, 6];
                            case 5:
                                e_1 = _b.sent();
                                error = e_1;
                                console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] I experienced the following error: ").concat(error));
                                status_1 = error.statusCode || error.code || 500;
                                message = error.message || 'internal error';
                                res.send({ status: status_1, message: message });
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); })();
            }
            catch (e) {
                console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] I experienced the following error: ").concat(e));
                res.send({ status: 'failure', msg: 'Code validation failed' });
            }
            return [2 /*return*/];
        });
    }); });
    // chat
    server.post('/tools/parse-article', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var contentUrl, input, error, status_2, message;
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
                    console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] I experienced the following error: ").concat(error));
                    var status = error.statusCode || error.code || 500;
                    var message = error.message || 'internal error';
                    res.send({ status: status, message: message });
                });
            }
            catch (e) {
                error = e;
                console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] I experienced the following error: ").concat(error));
                status_2 = error.statusCode || error.code || 500;
                message = error.message || 'internal error';
                res.send({ status: status_2, message: message });
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
        var videoUrl, error, status_3, message;
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
                console.log('🟣', "[".concat(currentConversationId, " - ").concat(currentMessageId, "] I experienced the following error: ").concat(error));
                status_3 = error.statusCode || error.code || 500;
                message = error.message || 'internal error';
                res.send({ status: status_3, message: message });
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