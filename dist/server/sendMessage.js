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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
var formation_1 = require("@avsync.live/formation");
var tsimportlib_1 = require("tsimportlib");
var clients = {};
var sendMessage = function (_a) {
    var conversationId = _a.conversationId, parentMessageId = _a.parentMessageId, personaLabel = _a.personaLabel, systemMessage = _a.systemMessage, userLabel = _a.userLabel, message = _a.message, onComplete = _a.onComplete, onProgress = _a.onProgress;
    return __awaiter(void 0, void 0, void 0, function () {
        var guid, storedClient, ChatGPTAPI, api, onProgressWrapper, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    guid = (0, formation_1.generateUUID)();
                    storedClient = clients["".concat(systemMessage, "-").concat(personaLabel, "-").concat(userLabel)];
                    if (!!storedClient) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, tsimportlib_1.dynamicImport)('chatgpt', module)];
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
                    onComplete({
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
exports.sendMessage = sendMessage;
