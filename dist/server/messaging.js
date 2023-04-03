"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMessagingServer = void 0;
var ws_1 = __importDefault(require("ws"));
var sendMessage_1 = require("./sendMessage");
var startMessagingServer = function (port) {
    var wss = new ws_1.default.Server({ port: port });
    wss.on('connection', function connection(ws) {
        ws.on('message', function (message) {
            var action = JSON.parse(message.toString());
            if (action.type === 'ping') {
                ws.send(JSON.stringify({
                    type: 'pong',
                    message: {},
                    time: new Date().toLocaleTimeString([], {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    guid: action.guid,
                    status: 200,
                    messageTime: action.messageTime,
                }));
            }
            if (action.type === 'message') {
                console.log(action);
                (0, sendMessage_1.sendMessage)({
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
                            type: action.personaLabel === 'GENERATE'
                                ? 'GENERATE_response'
                                : 'response',
                            message: response || '',
                            guid: action.guid,
                            conversationId: conversationId,
                            parentMessageId: parentMessageId,
                            personaLabel: action.personaLabel,
                            systemMessage: action.systemMessage,
                            userLabel: action.userLabel,
                            status: 200,
                            messageTime: action.messageTime,
                        }));
                    },
                    onProgress: function (_a) {
                        var response = _a.response, parentMessageId = _a.parentMessageId, conversationId = _a.conversationId, progress = _a.progress;
                        ws.send(JSON.stringify({
                            type: action.personaLabel === 'GENERATE'
                                ? 'GENERATE_partial-response'
                                : 'partial-response',
                            message: response || '',
                            guid: action.guid,
                            conversationId: conversationId,
                            parentMessageId: parentMessageId,
                            personaLabel: action.personaLabel,
                            systemMessage: action.systemMessage,
                            userLabel: action.userLabel,
                            status: 200,
                            messageTime: action.messageTime,
                            progress: progress,
                        }));
                    },
                });
            }
        });
    });
};
exports.startMessagingServer = startMessagingServer;
